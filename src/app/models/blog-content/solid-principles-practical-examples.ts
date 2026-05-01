export const CONTENT = `
      <p>You've heard of SOLID principles but every tutorial shows abstract <code>Shape</code> and <code>Animal</code> examples that don't match real codebases. This guide teaches SOLID through <strong>real-world code</strong> — the kind you actually write at work. For each principle, you'll see bad code, understand <em>why</em> it causes problems, and refactor it into something maintainable.</p>

      <h2>What is SOLID?</h2>
      <p>SOLID is a set of 5 design principles that help you write code that's <strong>easy to change, easy to test, and easy to understand</strong>. They were coined by Robert C. Martin (Uncle Bob) and have stood the test of time across every object-oriented language.</p>

      <!-- SOLID Overview -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The 5 SOLID Principles</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">S</span>Single<span class="pipeline-step-sub">Responsibility</span></div>
          <div class="pipeline-step" style="background:#22c55e;--i:1"><span class="pipeline-step-icon">O</span>Open<span class="pipeline-step-sub">Closed</span></div>
          <div class="pipeline-step" style="background:#a855f7;--i:2"><span class="pipeline-step-icon">L</span>Liskov<span class="pipeline-step-sub">Substitution</span></div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">I</span>Interface<span class="pipeline-step-sub">Segregation</span></div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">D</span>Dependency<span class="pipeline-step-sub">Inversion</span></div>
        </div>
      </div>

      <h2>S — Single Responsibility Principle</h2>
      <p><strong>"A class should have only one reason to change."</strong></p>
      <p>If a class handles user authentication AND sends emails AND logs to a file, changing any one of those features risks breaking the others. Each class should do one thing well.</p>

      <pre><code># &#x274C; BAD: One class doing everything
class UserService:
    def register(self, email, password):
        # Validate input
        if not re.match(r'^[\\w.-]+@[\\w.-]+\\.\\w+', email):
            raise ValueError("Invalid email")

        # Hash password
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        # Save to database
        db.execute("INSERT INTO users (email, password) VALUES (?, ?)",
                   (email, hashed))

        # Send welcome email
        smtp = smtplib.SMTP('smtp.gmail.com', 587)
        smtp.starttls()
        smtp.login('noreply@app.com', 'password')
        smtp.sendmail('noreply@app.com', email, 'Welcome!')
        smtp.quit()

        # Log the event
        with open('app.log', 'a') as f:
            f.write(f"{datetime.now()}: User registered: {email}\\n")

# Problem: If you change email provider, you edit UserService.
# If you change logging format, you edit UserService.
# If you change database, you edit UserService.
# One class, 4 reasons to change = guaranteed bugs.</code></pre>

      <pre><code># &#x2705; GOOD: Each class has one responsibility
class UserValidator:
    def validate_email(self, email: str) -> bool:
        return bool(re.match(r'^[\\w.-]+@[\\w.-]+\\.\\w+', email))

class PasswordHasher:
    def hash(self, password: str) -> bytes:
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

class UserRepository:
    def __init__(self, db):
        self.db = db
    def save(self, email: str, password_hash: bytes):
        self.db.execute("INSERT INTO users ...", (email, password_hash))

class EmailService:
    def send_welcome(self, email: str):
        # Email logic isolated here — change provider without touching users
        pass

class UserService:
    def __init__(self, validator, hasher, repo, emailer):
        self.validator = validator
        self.hasher = hasher
        self.repo = repo
        self.emailer = emailer

    def register(self, email: str, password: str):
        if not self.validator.validate_email(email):
            raise ValueError("Invalid email")
        password_hash = self.hasher.hash(password)
        self.repo.save(email, password_hash)
        self.emailer.send_welcome(email)

# Now UserService orchestrates, but each piece changes independently.
# Change email provider? Edit EmailService only.
# Change database? Edit UserRepository only.
# Each class has ONE reason to change.</code></pre>

      <h2>O — Open/Closed Principle</h2>
      <p><strong>"Software entities should be open for extension, but closed for modification."</strong></p>
      <p>You should be able to add new behavior <em>without changing existing code</em>. This prevents introducing bugs in working features when adding new ones.</p>

      <pre><code># &#x274C; BAD: Adding a new payment method requires modifying existing code
class PaymentProcessor:
    def process(self, payment_type: str, amount: float):
        if payment_type == "credit_card":
            # Process credit card
            stripe.charge(amount)
        elif payment_type == "paypal":
            # Process PayPal
            paypal.send(amount)
        elif payment_type == "crypto":
            # Every new payment method = modify this function
            # Risk breaking credit card and PayPal logic!
            bitcoin.transfer(amount)

# Every new payment method adds another elif.
# The function grows forever. Testing becomes a nightmare.</code></pre>

      <pre><code># &#x2705; GOOD: Open for extension, closed for modification
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount: float) -> bool:
        pass

class CreditCardPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        return stripe.charge(amount)

class PayPalPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        return paypal.send(amount)

# Adding crypto? Just add a NEW class. No existing code modified!
class CryptoPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        return bitcoin.transfer(amount)

class PaymentProcessor:
    def process(self, method: PaymentMethod, amount: float):
        return method.process(amount)

# Usage:
processor = PaymentProcessor()
processor.process(CreditCardPayment(), 99.99)
processor.process(CryptoPayment(), 0.005)
# Adding new payment methods never touches PaymentProcessor!</code></pre>

      <h2>L — Liskov Substitution Principle</h2>
      <p><strong>"Subtypes must be substitutable for their base types without breaking the program."</strong></p>
      <p>If your code works with a base class, it should work with <em>any</em> subclass without surprises. A subclass that changes the expected behavior violates LSP.</p>

      <pre><code># &#x274C; BAD: Square violates Rectangle's contract
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)

    # Override to keep width == height (Square invariant)
    @property
    def width(self):
        return self._side
    @width.setter
    def width(self, value):
        self._side = value  # Also changes height!

# Code that works with Rectangle breaks with Square:
def double_width(rect: Rectangle):
    rect.width = rect.width * 2
    return rect.area()
    # Expected: width*2 * height (unchanged)
    # With Square: side*2 * side*2 = 4x area (WRONG!)</code></pre>

      <pre><code># &#x2705; GOOD: Use composition or separate interfaces
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    def area(self) -> float:
        return self.width * self.height

class Square(Shape):
    def __init__(self, side: float):
        self.side = side
    def area(self) -> float:
        return self.side * self.side

# Both are Shapes. Both have area(). Neither pretends to be the other.
# Any code using Shape works correctly with both.</code></pre>

      <h2>I — Interface Segregation Principle</h2>
      <p><strong>"No client should be forced to depend on methods it doesn't use."</strong></p>

      <pre><code># &#x274C; BAD: Fat interface forces unnecessary implementations
class Worker(ABC):
    @abstractmethod
    def code(self): pass
    @abstractmethod
    def test(self): pass
    @abstractmethod
    def design(self): pass
    @abstractmethod
    def manage_team(self): pass

class JuniorDeveloper(Worker):
    def code(self): return "Writing Python"
    def test(self): return "Writing tests"
    def design(self): raise NotImplementedError("Juniors don't design!")
    def manage_team(self): raise NotImplementedError("Juniors don't manage!")
    # Forced to implement methods that make no sense!</code></pre>

      <pre><code># &#x2705; GOOD: Small, focused interfaces
class Coder(ABC):
    @abstractmethod
    def code(self): pass

class Tester(ABC):
    @abstractmethod
    def test(self): pass

class Designer(ABC):
    @abstractmethod
    def design(self): pass

class TeamLead(ABC):
    @abstractmethod
    def manage_team(self): pass

# Each role implements only what it actually does:
class JuniorDev(Coder, Tester):
    def code(self): return "Writing Python"
    def test(self): return "Writing unit tests"

class SeniorDev(Coder, Tester, Designer):
    def code(self): return "Writing Python + Go"
    def test(self): return "Writing integration tests"
    def design(self): return "System architecture"

class TechLead(Coder, Designer, TeamLead):
    def code(self): return "Reviewing PRs"
    def design(self): return "Technical decisions"
    def manage_team(self): return "Sprint planning"</code></pre>

      <h2>D — Dependency Inversion Principle</h2>
      <p><strong>"High-level modules should not depend on low-level modules. Both should depend on abstractions."</strong></p>

      <pre><code># &#x274C; BAD: High-level OrderService depends directly on low-level MySQLDatabase
class MySQLDatabase:
    def save_order(self, order):
        # MySQL-specific code
        pass

class OrderService:
    def __init__(self):
        self.db = MySQLDatabase()  # Hardcoded dependency!

    def create_order(self, items):
        order = {"items": items, "total": sum(i["price"] for i in items)}
        self.db.save_order(order)
        return order

# Problem: Can't switch to PostgreSQL without rewriting OrderService.
# Can't unit test without a real MySQL database.</code></pre>

      <pre><code># &#x2705; GOOD: Both depend on abstraction (interface)
class OrderRepository(ABC):
    @abstractmethod
    def save(self, order: dict) -> str: pass

class MySQLOrderRepo(OrderRepository):
    def save(self, order: dict) -> str:
        # MySQL implementation
        return "mysql-order-id"

class PostgresOrderRepo(OrderRepository):
    def save(self, order: dict) -> str:
        # PostgreSQL implementation
        return "pg-order-id"

class InMemoryOrderRepo(OrderRepository):
    """For unit testing — no database needed!"""
    def __init__(self):
        self.orders = []
    def save(self, order: dict) -> str:
        self.orders.append(order)
        return f"mem-{len(self.orders)}"

class OrderService:
    def __init__(self, repo: OrderRepository):  # Depends on abstraction!
        self.repo = repo

    def create_order(self, items):
        order = {"items": items, "total": sum(i["price"] for i in items)}
        order_id = self.repo.save(order)
        return {"id": order_id, **order}

# Production:
service = OrderService(PostgresOrderRepo())

# Testing (no database!):
service = OrderService(InMemoryOrderRepo())
result = service.create_order([{"name": "Widget", "price": 9.99}])
assert result["total"] == 9.99  # Fast, isolated test!</code></pre>

      <h2>SOLID Cheat Sheet</h2>

      <!-- Cheat Sheet -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SOLID Quick Reference</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">S — Single Responsibility</div><div class="timeline-item-desc">One class = one job. If you describe a class with "AND", split it.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">O — Open/Closed</div><div class="timeline-item-desc">Add new features by adding new code, not changing existing code. Use polymorphism.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">L — Liskov Substitution</div><div class="timeline-item-desc">Subclasses must work wherever the parent class works. No surprises.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">I — Interface Segregation</div><div class="timeline-item-desc">Many small interfaces &gt; one fat interface. Don't force classes to implement unused methods.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">D — Dependency Inversion</div><div class="timeline-item-desc">Depend on abstractions (interfaces), not concretions (specific implementations). Inject dependencies.</div></div>
        </div>
      </div>

      <p>SOLID principles aren't about writing perfect code — they're about writing code that <strong>survives contact with reality</strong>. Requirements change, teams change, and bugs happen. SOLID gives your codebase the flexibility to handle all of that without collapsing. Start with Single Responsibility and Dependency Inversion — they give the biggest payoff with the least effort. The rest will follow naturally as your design sense improves.</p>
    `;
