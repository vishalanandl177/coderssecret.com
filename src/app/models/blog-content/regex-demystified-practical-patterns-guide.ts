export const CONTENT = `
      <p>Regular expressions have the worst reputation in programming. They look like someone smashed the keyboard: <code>^(?:[a-zA-Z0-9._%+-]+)@(?:[a-zA-Z0-9.-]+)\\.(?:[a-zA-Z]{2,})$</code>. But regex is just a language with a small vocabulary. Learn 10 symbols and you can read any pattern.</p>

      <h2>The Building Blocks</h2>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Meaning</th>
            <th>Example</th>
            <th>Matches</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>.</code></td>
            <td>Any character (except newline)</td>
            <td><code>h.t</code></td>
            <td>hat, hot, hit</td>
          </tr>
          <tr>
            <td><code>*</code></td>
            <td>Zero or more of previous</td>
            <td><code>ab*c</code></td>
            <td>ac, abc, abbc</td>
          </tr>
          <tr>
            <td><code>+</code></td>
            <td>One or more of previous</td>
            <td><code>ab+c</code></td>
            <td>abc, abbc (not ac)</td>
          </tr>
          <tr>
            <td><code>?</code></td>
            <td>Zero or one of previous</td>
            <td><code>colou?r</code></td>
            <td>color, colour</td>
          </tr>
          <tr>
            <td><code>^</code></td>
            <td>Start of string</td>
            <td><code>^Hello</code></td>
            <td>Hello world (not Say Hello)</td>
          </tr>
          <tr>
            <td><code>$</code></td>
            <td>End of string</td>
            <td><code>end$</code></td>
            <td>the end (not endless)</td>
          </tr>
          <tr>
            <td><code>[abc]</code></td>
            <td>Any one of these characters</td>
            <td><code>[aeiou]</code></td>
            <td>any vowel</td>
          </tr>
          <tr>
            <td><code>[^abc]</code></td>
            <td>Any character NOT in set</td>
            <td><code>[^0-9]</code></td>
            <td>any non-digit</td>
          </tr>
          <tr>
            <td><code>(group)</code></td>
            <td>Capture group</td>
            <td><code>(\\d{3})</code></td>
            <td>captures 3 digits</td>
          </tr>
          <tr>
            <td><code>a|b</code></td>
            <td>Either a or b</td>
            <td><code>cat|dog</code></td>
            <td>cat or dog</td>
          </tr>
        </tbody>
      </table>

      <h2>Character Classes (Shortcuts)</h2>

      <table>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>Equivalent</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>\\d</code></td>
            <td><code>[0-9]</code></td>
            <td>Any digit</td>
          </tr>
          <tr>
            <td><code>\\D</code></td>
            <td><code>[^0-9]</code></td>
            <td>Any non-digit</td>
          </tr>
          <tr>
            <td><code>\\w</code></td>
            <td><code>[a-zA-Z0-9_]</code></td>
            <td>Any word character</td>
          </tr>
          <tr>
            <td><code>\\W</code></td>
            <td><code>[^a-zA-Z0-9_]</code></td>
            <td>Any non-word character</td>
          </tr>
          <tr>
            <td><code>\\s</code></td>
            <td><code>[ \\t\\n\\r\\f]</code></td>
            <td>Any whitespace</td>
          </tr>
          <tr>
            <td><code>\\S</code></td>
            <td><code>[^ \\t\\n\\r\\f]</code></td>
            <td>Any non-whitespace</td>
          </tr>
          <tr>
            <td><code>\\b</code></td>
            <td>n/a</td>
            <td>Word boundary</td>
          </tr>
        </tbody>
      </table>

      <h2>Quantifiers</h2>

      <pre><code># Exact, minimum, range
\\d{3}        # Exactly 3 digits: 123
\\d{2,4}      # 2 to 4 digits: 12, 123, 1234
\\d{3,}       # 3 or more digits: 123, 123456

# Greedy vs Lazy
.*           # Greedy: matches as MUCH as possible
.*?          # Lazy: matches as LITTLE as possible

# Example:
# Input: "&lt;b&gt;hello&lt;/b&gt; world &lt;b&gt;foo&lt;/b&gt;"
# &lt;b&gt;.*&lt;/b&gt;   matches: "&lt;b&gt;hello&lt;/b&gt; world &lt;b&gt;foo&lt;/b&gt;"  (greedy: everything)
# &lt;b&gt;.*?&lt;/b&gt;  matches: "&lt;b&gt;hello&lt;/b&gt;"                      (lazy: first match)</code></pre>

      <h2>Reading Regex Left to Right</h2>

      <p>Every regex can be read as a sentence. Let us decode a real-world pattern:</p>

      <pre><code># Pattern: ^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$
# Reading left to right:
# ^            Start of string
# \\d{4}        4 digits (year)
# -            literal dash
# \\d{2}        2 digits (month)
# -            literal dash
# \\d{2}        2 digits (day)
# T            literal "T"
# \\d{2}        2 digits (hour)
# :            literal colon
# \\d{2}        2 digits (minute)
# :            literal colon
# \\d{2}        2 digits (second)
# Z            literal "Z" (UTC)
# $            End of string
# Result: ISO 8601 datetime like "2026-04-28T10:30:00Z"</code></pre>

      <h2>Practical Patterns You Will Actually Use</h2>

      <h3>1. Email Validation (Practical, Not RFC-Perfect)</h3>

      <pre><code>import re

email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
# ^                      Start
# [a-zA-Z0-9._%+-]+      One or more valid username chars
# @                      Literal @
# [a-zA-Z0-9.-]+         One or more domain chars
# \.                     Literal dot
# [a-zA-Z]{2,}           Two or more letter TLD
# $                      End

re.match(email_pattern, "user@example.com")      # Match
re.match(email_pattern, "user@.com")             # No match
re.match(email_pattern, "@example.com")          # No match</code></pre>

      <h3>2. URL Extraction</h3>

      <pre><code>url_pattern = r'https?://[^\\s&lt;&gt;"{}|\\\\^&#96;\\[\\]]+'

text = "Visit https://example.com/path?q=1 or http://test.org for more"
urls = re.findall(url_pattern, text)
# ['https://example.com/path?q=1', 'http://test.org']</code></pre>

      <h3>3. Log Parsing</h3>

      <pre><code># Apache log format:
# 192.168.1.1 - - [28/Apr/2026:10:30:00 +0530] "GET /api/users HTTP/1.1" 200 1234

log_pattern = r'([\d.]+) .+ \[(.+?)\] "(\w+) (.+?) HTTP/.+" (\d{3}) (\d+)'

line = '192.168.1.1 - - [28/Apr/2026:10:30:00 +0530] "GET /api/users HTTP/1.1" 200 1234'
match = re.match(log_pattern, line)
if match:
    ip, timestamp, method, path, status, size = match.groups()
    # ip="192.168.1.1", method="GET", path="/api/users", status="200"</code></pre>

      <h3>4. Password Validation</h3>

      <pre><code># At least 8 chars, one uppercase, one lowercase, one digit, one special
password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'

# (?=.*[a-z])     Lookahead: must contain lowercase
# (?=.*[A-Z])     Lookahead: must contain uppercase
# (?=.*\d)        Lookahead: must contain digit
# (?=.*[@$!%*?&]) Lookahead: must contain special char
# [A-Za-z...]{8,} Match 8+ chars from allowed set

re.match(password_pattern, "Passw0rd!")    # Match
re.match(password_pattern, "password")     # No match (no upper, digit, special)
re.match(password_pattern, "SHORT1!")      # No match (too short)</code></pre>

      <h3>5. Find and Replace with Capture Groups</h3>

      <pre><code># Reformat dates from MM/DD/YYYY to YYYY-MM-DD
text = "Created on 04/28/2026 and updated on 05/15/2026"
result = re.sub(
    r'(\d{2})/(\d{2})/(\d{4})',
    r'\\3-\\1-\\2',           # Backreference: \\1=month, \\2=day, \\3=year
    text
)
# "Created on 2026-04-28 and updated on 2026-05-15"</code></pre>

      <h3>6. Named Capture Groups</h3>

      <pre><code># Named groups make code self-documenting
pattern = r'(?P&lt;year&gt;\\d{4})-(?P&lt;month&gt;\\d{2})-(?P&lt;day&gt;\\d{2})'
match = re.match(pattern, "2026-04-28")
print(match.group("year"))    # "2026"
print(match.group("month"))   # "04"
print(match.group("day"))     # "28"</code></pre>

      <h3>7. Extract Data from Structured Text</h3>

      <pre><code># Extract key-value pairs from config files
config_text = """
host = localhost
port = 5432
database = myapp_production
max_connections = 100
"""

pairs = re.findall(r'^(\w+)\s*=\s*(.+)$', config_text, re.MULTILINE)
config = dict(pairs)
# {"host": "localhost", "port": "5432", "database": "myapp_production", ...}</code></pre>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>Forgetting to escape dots:</strong> <code>.</code> matches ANY character, <code>\\.</code> matches a literal dot. <code>example.com</code> also matches <code>exampleXcom</code>.</li>
        <li><strong>Greedy by default:</strong> <code>.*</code> grabs as much as possible. Use <code>.*?</code> for the shortest match.</li>
        <li><strong>Not anchoring:</strong> Without <code>^</code> and <code>$</code>, the pattern can match anywhere in the string. <code>\\d{3}</code> matches &ldquo;123&rdquo; inside &ldquo;abc123def&rdquo;.</li>
        <li><strong>Catastrophic backtracking:</strong> Nested quantifiers like <code>(a+)+</code> can take exponential time on non-matching strings. Avoid nested repetition.</li>
        <li><strong>Using regex for HTML parsing:</strong> HTML is not a regular language. Use a proper parser (BeautifulSoup, DOMParser) instead of regex for HTML.</li>
      </ul>

      <h2>Quick Reference Cheat Sheet</h2>

      <pre><code># Anchors
^          Start of string
$          End of string
\\b         Word boundary

# Quantifiers
*          0 or more
+          1 or more
?          0 or 1
{n}        Exactly n
{n,m}      Between n and m
{n,}       n or more

# Groups
(abc)      Capture group
(?:abc)    Non-capturing group
(?=abc)    Positive lookahead
(?!abc)    Negative lookahead

# Character classes
[abc]      One of a, b, or c
[a-z]      Range: a through z
[^abc]     Not a, b, or c
\\d \\w \\s   Digit, word char, whitespace
\\D \\W \\S   Negated versions

# Flags (Python)
re.IGNORECASE   (re.I)   Case-insensitive
re.MULTILINE    (re.M)   ^ and $ match line boundaries
re.DOTALL       (re.S)   . matches newlines too</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Read regex left to right</strong> like a sentence &mdash; each symbol has a simple meaning</li>
        <li><strong>Learn 10 symbols and you can read 90% of regex:</strong> <code>. * + ? ^ $ [] () | \\</code></li>
        <li><strong>Use raw strings in Python</strong> (<code>r'pattern'</code>) to avoid escaping backslashes</li>
        <li><strong>Use named capture groups</strong> for readability &mdash; <code>(?P&lt;name&gt;...)</code> is self-documenting</li>
        <li><strong>Test regex interactively</strong> at regex101.com &mdash; it visualizes matches and explains each part</li>
        <li><strong>Do not use regex for HTML, JSON, or XML</strong> &mdash; use proper parsers for structured formats</li>
        <li><strong>Keep patterns simple</strong> &mdash; if a regex is unreadable, split the validation into multiple simpler checks</li>
      </ul>

      <p>Regex is a tool, not a test of intelligence. If you can read the 10 basic symbols, you can understand any regex by reading it character by character. The fear goes away the moment you stop trying to read patterns as a whole and start reading them left to right, one token at a time.</p>
    `;
