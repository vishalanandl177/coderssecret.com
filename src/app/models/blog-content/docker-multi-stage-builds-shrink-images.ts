export const CONTENT = `
      <p>Run <code>docker images</code> right now. If your production image is over 500MB, you are shipping build tools, package managers, source code, and dev dependencies straight to production. That is wasted bandwidth, slower deployments, a larger attack surface, and higher cloud bills.</p>

      <p>Docker multi-stage builds solve this by separating the <strong>build environment</strong> from the <strong>runtime environment</strong>. You compile in one stage and copy only the final artifact to a minimal base image. The result: images that are 5-50x smaller.</p>

      <h2>The Problem: Why Images Get Bloated</h2>

      <p>A typical single-stage Dockerfile accumulates everything:</p>

      <pre><code># The classic mistake: single-stage build
FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install          # Includes devDependencies!
COPY . .                 # Includes source, tests, docs
RUN npm run build        # Build tools remain in image

EXPOSE 3000
CMD ["node", "dist/main.js"]

# Result: ~1.2GB image containing:
# - Node.js full runtime + npm
# - node_modules with devDependencies (TypeScript, ESLint, Jest...)
# - Source .ts files (not needed after compilation)
# - Test files, README, .git artifacts</code></pre>

      <h2>Multi-Stage: The Concept</h2>

      <p>A multi-stage Dockerfile uses multiple <code>FROM</code> statements. Each <code>FROM</code> starts a new stage. You can copy artifacts from earlier stages into later ones using <code>COPY --from</code>. Only the final stage becomes your image.</p>

      <pre><code># Stage 1: Build (thrown away)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (this becomes the image)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]

# Result: ~180MB (alpine base + production deps only)</code></pre>

      <h2>Real-World Examples</h2>

      <h3>1. Angular Application (1.2GB &rarr; 45MB)</h3>

      <pre><code># Stage 1: Build the Angular app
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist/my-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Before: node:20 base (1.2GB)
# After:  nginx:alpine (45MB)</code></pre>

      <h3>2. Python/Django Application (900MB &rarr; 120MB)</h3>

      <pre><code># Stage 1: Build dependencies
FROM python:3.12 AS builder
WORKDIR /app

# Install dependencies into a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.12-slim
WORKDIR /app

# Copy only the virtual environment
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]

# Before: python:3.12 full (900MB, includes gcc, make, headers)
# After:  python:3.12-slim (120MB, runtime only)</code></pre>

      <h3>3. Go Application (800MB &rarr; 12MB)</h3>

      <pre><code># Stage 1: Build the Go binary
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Stage 2: Scratch (literally empty)
FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080
ENTRYPOINT ["/server"]

# Before: golang:1.22 (800MB, includes Go compiler + stdlib)
# After:  scratch + binary (12MB, just the executable)</code></pre>

      <p>Go is the best case for multi-stage builds. Since Go compiles to a static binary, the final image needs literally nothing except the binary itself. The <code>scratch</code> base image is an empty filesystem.</p>

      <h3>4. Java/Spring Boot Application (600MB &rarr; 180MB)</h3>

      <pre><code># Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline    # Cache dependencies
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: JRE only
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

# Before: maven + full JDK (600MB)
# After:  JRE alpine only (180MB)</code></pre>

      <h2>Size Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Language</th>
            <th>Single-Stage</th>
            <th>Multi-Stage</th>
            <th>Reduction</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Angular (nginx)</td>
            <td>1.2 GB</td>
            <td>45 MB</td>
            <td>96%</td>
          </tr>
          <tr>
            <td>Python/Django</td>
            <td>900 MB</td>
            <td>120 MB</td>
            <td>87%</td>
          </tr>
          <tr>
            <td>Go</td>
            <td>800 MB</td>
            <td>12 MB</td>
            <td>98%</td>
          </tr>
          <tr>
            <td>Java/Spring Boot</td>
            <td>600 MB</td>
            <td>180 MB</td>
            <td>70%</td>
          </tr>
          <tr>
            <td>Node.js API</td>
            <td>1.1 GB</td>
            <td>180 MB</td>
            <td>84%</td>
          </tr>
        </tbody>
      </table>

      <h2>Layer Caching Optimization</h2>

      <p>Docker caches each layer. If a layer has not changed, Docker reuses it. The key insight: <strong>order instructions from least-frequently-changed to most-frequently-changed</strong>.</p>

      <pre><code># Bad: COPY all files first, invalidating cache on every code change
COPY . .
RUN npm ci
RUN npm run build

# Good: Copy dependency files first, then source
COPY package.json package-lock.json ./
RUN npm ci                    # Cached unless package files change
COPY . .                      # Only this layer rebuilds on code changes
RUN npm run build</code></pre>

      <p>This means <code>npm ci</code> only reruns when your dependencies actually change &mdash; not every time you edit a source file. On a project with 500MB of node_modules, this saves minutes per build.</p>

      <h2>BuildKit Advanced Features</h2>

      <p>Docker BuildKit (enabled by default since Docker 23.0) adds powerful capabilities:</p>

      <h3>Cache Mounts</h3>

      <pre><code># Persistent cache for package managers across builds
FROM python:3.12 AS builder
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt

# npm cache
FROM node:20 AS builder
RUN --mount=type=cache,target=/root/.npm \\
    npm ci

# Go module cache
FROM golang:1.22 AS builder
RUN --mount=type=cache,target=/go/pkg/mod \\
    go mod download</code></pre>

      <h3>Parallel Stage Execution</h3>

      <pre><code># BuildKit automatically parallelizes independent stages
FROM node:20 AS frontend-builder
COPY frontend/ .
RUN npm run build

FROM golang:1.22 AS backend-builder
COPY backend/ .
RUN go build -o server

# Both stages build simultaneously!
FROM alpine:3.19
COPY --from=frontend-builder /app/dist /static
COPY --from=backend-builder /app/server /server</code></pre>

      <h2>Security Hardening</h2>

      <h3>Non-Root User</h3>

      <pre><code>FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
USER appuser
CMD ["node", "dist/main.js"]</code></pre>

      <h3>Distroless Base Images</h3>

      <pre><code># Google's distroless: no shell, no package manager, no OS utilities
FROM gcr.io/distroless/nodejs20-debian12
COPY --from=builder /app/dist /app
CMD ["app/main.js"]

# Even an attacker with RCE cannot spawn a shell &mdash; there isn't one</code></pre>

      <h3>Scan for Vulnerabilities</h3>

      <pre><code># Scan your image before pushing
docker scout cves my-app:latest

# Or use Trivy
trivy image my-app:latest</code></pre>

      <h2>.dockerignore Best Practices</h2>

      <p>A proper <code>.dockerignore</code> prevents unnecessary files from entering the build context, speeding up builds and reducing image size:</p>

      <pre><code># .dockerignore
node_modules
.git
.gitignore
*.md
LICENSE
.env*
.vscode
.idea
coverage
test
tests
__tests__
__pycache__
*.pyc
.pytest_cache
dist
build
docker-compose*.yml
Dockerfile*</code></pre>

      <h2>CI/CD Integration</h2>

      <pre><code># .github/workflows/build.yml
name: Build and Push
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/myorg/myapp:latest
          cache-from: type=gha       # GitHub Actions cache
          cache-to: type=gha,mode=max</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Every production Dockerfile should be multi-stage</strong> &mdash; there is no reason to ship compilers and dev tools</li>
        <li><strong>Use alpine or slim base images</strong> for runtime stages &mdash; full OS images are rarely needed</li>
        <li><strong>For Go, use scratch or distroless</strong> &mdash; static binaries need almost nothing</li>
        <li><strong>Order Dockerfile instructions for cache efficiency</strong> &mdash; dependency files before source code</li>
        <li><strong>Use BuildKit cache mounts</strong> for persistent package manager caches across builds</li>
        <li><strong>Always run as non-root</strong> and consider distroless images for maximum security</li>
        <li><strong>Scan your images for vulnerabilities</strong> before deploying to production</li>
        <li><strong>Write a comprehensive .dockerignore</strong> &mdash; it is as important as the Dockerfile itself</li>
      </ul>

      <p>Smaller images mean faster deployments, lower storage costs, reduced bandwidth, and a smaller attack surface. There is no downside to multi-stage builds &mdash; only upside. If your production image is over 200MB, you almost certainly have optimization opportunities waiting.</p>
    `;
