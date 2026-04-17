import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Section {
  title: string;
  items: { cmd: string; desc: string }[];
}

@Component({
  selector: 'app-cheatsheet-docker',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/cheatsheets" class="hover:text-foreground transition-colors">Cheat Sheets</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Docker</li>
          </ol>
        </nav>

        <div class="flex items-center gap-4 mb-8">
          <span class="text-5xl">🐳</span>
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Docker Cheat Sheet</h1>
            <p class="text-muted-foreground mt-1">Build, run, and manage containers — all essential commands</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          @for (section of sections; track section.title) {
            <div class="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div class="px-5 py-3 bg-muted/50 border-b border-border/40">
                <h2 class="text-sm font-bold uppercase tracking-wider">{{ section.title }}</h2>
              </div>
              <div class="divide-y divide-border/40">
                @for (item of section.items; track item.cmd) {
                  <div class="px-5 py-3 flex gap-4 hover:bg-accent/30 transition-colors">
                    <code class="text-xs font-mono bg-muted px-2 py-1 rounded flex-shrink-0 max-w-[55%] overflow-x-auto whitespace-nowrap">{{ item.cmd }}</code>
                    <span class="text-xs text-muted-foreground">{{ item.desc }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="mt-8 text-center">
          <a routerLink="/cheatsheets" class="text-sm text-muted-foreground hover:text-foreground">← All Cheat Sheets</a>
          <span class="mx-3 text-muted-foreground/50">|</span>
          <a routerLink="/blog" [queryParams]="{tag:'Docker'}" class="text-sm text-primary hover:underline">Read Docker tutorials →</a>
        </div>
      </div>
    </section>
  `,
})
export class DockerCheatsheetComponent {
  private seo = inject(SeoService);

  sections: Section[] = [
    {
        "title": "Images",
        "items": [
            {
                "cmd": "docker build -t name:tag .",
                "desc": "Build image from Dockerfile"
            },
            {
                "cmd": "docker images",
                "desc": "List local images"
            },
            {
                "cmd": "docker pull nginx:latest",
                "desc": "Pull image from registry"
            },
            {
                "cmd": "docker push user/img:tag",
                "desc": "Push to registry"
            },
            {
                "cmd": "docker rmi image_id",
                "desc": "Remove image"
            },
            {
                "cmd": "docker image prune",
                "desc": "Remove unused images"
            },
            {
                "cmd": "docker tag img:v1 img:latest",
                "desc": "Tag image"
            }
        ]
    },
    {
        "title": "Containers",
        "items": [
            {
                "cmd": "docker run -d --name app img",
                "desc": "Run detached"
            },
            {
                "cmd": "docker run -it img bash",
                "desc": "Interactive shell"
            },
            {
                "cmd": "docker run -p 8080:80 img",
                "desc": "Map port"
            },
            {
                "cmd": "docker run -v ./data:/data img",
                "desc": "Mount volume"
            },
            {
                "cmd": "docker run -e KEY=val img",
                "desc": "Set env variable"
            },
            {
                "cmd": "docker run --rm img",
                "desc": "Remove after exit"
            },
            {
                "cmd": "docker ps",
                "desc": "Running containers"
            },
            {
                "cmd": "docker ps -a",
                "desc": "All containers"
            },
            {
                "cmd": "docker stop NAME",
                "desc": "Stop container"
            },
            {
                "cmd": "docker rm NAME",
                "desc": "Remove container"
            },
            {
                "cmd": "docker restart NAME",
                "desc": "Restart container"
            }
        ]
    },
    {
        "title": "Debugging",
        "items": [
            {
                "cmd": "docker logs NAME",
                "desc": "Container logs"
            },
            {
                "cmd": "docker logs -f NAME",
                "desc": "Stream logs"
            },
            {
                "cmd": "docker exec -it NAME bash",
                "desc": "Shell into running"
            },
            {
                "cmd": "docker inspect NAME",
                "desc": "Full container details"
            },
            {
                "cmd": "docker stats",
                "desc": "Live resource usage"
            },
            {
                "cmd": "docker top NAME",
                "desc": "Processes in container"
            },
            {
                "cmd": "docker diff NAME",
                "desc": "Changed files"
            }
        ]
    },
    {
        "title": "Docker Compose",
        "items": [
            {
                "cmd": "docker compose up -d",
                "desc": "Start all services"
            },
            {
                "cmd": "docker compose down",
                "desc": "Stop and remove"
            },
            {
                "cmd": "docker compose logs -f",
                "desc": "Stream all logs"
            },
            {
                "cmd": "docker compose ps",
                "desc": "Service status"
            },
            {
                "cmd": "docker compose build",
                "desc": "Rebuild services"
            },
            {
                "cmd": "docker compose exec svc bash",
                "desc": "Shell into service"
            },
            {
                "cmd": "docker compose pull",
                "desc": "Pull latest images"
            },
            {
                "cmd": "docker compose down -v",
                "desc": "Remove with volumes"
            }
        ]
    },
    {
        "title": "Volumes & Networks",
        "items": [
            {
                "cmd": "docker volume create vol",
                "desc": "Create volume"
            },
            {
                "cmd": "docker volume ls",
                "desc": "List volumes"
            },
            {
                "cmd": "docker volume rm vol",
                "desc": "Remove volume"
            },
            {
                "cmd": "docker network create net",
                "desc": "Create network"
            },
            {
                "cmd": "docker network ls",
                "desc": "List networks"
            },
            {
                "cmd": "docker network inspect net",
                "desc": "Network details"
            }
        ]
    },
    {
        "title": "Cleanup",
        "items": [
            {
                "cmd": "docker system prune",
                "desc": "Remove all unused"
            },
            {
                "cmd": "docker system prune -a",
                "desc": "Remove ALL (incl images)"
            },
            {
                "cmd": "docker system df",
                "desc": "Disk usage"
            },
            {
                "cmd": "docker container prune",
                "desc": "Remove stopped"
            },
            {
                "cmd": "docker volume prune",
                "desc": "Remove unused volumes"
            }
        ]
    }
];

  constructor() {
    this.seo.update({
      title: 'Docker Cheat Sheet 2026 — Quick Reference for Developers',
      description: 'Complete Docker cheat sheet: build, run, compose, volumes, networks, multi-stage builds, debugging containers, and image management.',
      url: '/cheatsheets/docker',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Cheat Sheets', url: '/cheatsheets' },
        { name: 'Docker', url: '/cheatsheets/docker' },
      ],
    });
  }
}
