import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Section {
  title: string;
  items: { cmd: string; desc: string }[];
}

@Component({
  selector: 'app-cheatsheet-kubernetes',
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
            <li class="text-foreground font-medium" aria-current="page">Kubernetes</li>
          </ol>
        </nav>

        <div class="flex items-center gap-4 mb-8">
          <span class="text-5xl">⎈</span>
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Kubernetes Cheat Sheet</h1>
            <p class="text-muted-foreground mt-1">Essential kubectl commands and Kubernetes patterns</p>
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
          <a routerLink="/blog" [queryParams]="{tag:'Kubernetes'}" class="text-sm text-primary hover:underline">Read Kubernetes tutorials →</a>
        </div>
      </div>
    </section>
  `,
})
export class KubernetesCheatsheetComponent {
  private seo = inject(SeoService);

  sections: Section[] = [
    {
        "title": "Cluster Info",
        "items": [
            {
                "cmd": "kubectl cluster-info",
                "desc": "Cluster endpoint info"
            },
            {
                "cmd": "kubectl get nodes",
                "desc": "List all nodes"
            },
            {
                "cmd": "kubectl get nodes -o wide",
                "desc": "Nodes with IPs and OS"
            },
            {
                "cmd": "kubectl top nodes",
                "desc": "Node resource usage"
            },
            {
                "cmd": "kubectl api-resources",
                "desc": "All resource types"
            },
            {
                "cmd": "kubectl get all -A",
                "desc": "Everything in all namespaces"
            }
        ]
    },
    {
        "title": "Pod Management",
        "items": [
            {
                "cmd": "kubectl get pods",
                "desc": "List pods in current ns"
            },
            {
                "cmd": "kubectl get pods -A",
                "desc": "Pods in all namespaces"
            },
            {
                "cmd": "kubectl get pods -o wide",
                "desc": "Pods with node/IP info"
            },
            {
                "cmd": "kubectl describe pod NAME",
                "desc": "Detailed pod info"
            },
            {
                "cmd": "kubectl logs NAME",
                "desc": "Pod logs"
            },
            {
                "cmd": "kubectl logs NAME --previous",
                "desc": "Crashed container logs"
            },
            {
                "cmd": "kubectl logs NAME -f",
                "desc": "Stream logs (follow)"
            },
            {
                "cmd": "kubectl exec -it NAME -- bash",
                "desc": "Shell into pod"
            },
            {
                "cmd": "kubectl delete pod NAME",
                "desc": "Delete a pod"
            },
            {
                "cmd": "kubectl run debug --image=busybox -it --rm -- sh",
                "desc": "Quick debug pod"
            }
        ]
    },
    {
        "title": "Deployments",
        "items": [
            {
                "cmd": "kubectl get deployments",
                "desc": "List deployments"
            },
            {
                "cmd": "kubectl create deploy NAME --image=IMG",
                "desc": "Create deployment"
            },
            {
                "cmd": "kubectl scale deploy NAME --replicas=3",
                "desc": "Scale replicas"
            },
            {
                "cmd": "kubectl rollout status deploy/NAME",
                "desc": "Watch rollout"
            },
            {
                "cmd": "kubectl rollout undo deploy/NAME",
                "desc": "Rollback deploy"
            },
            {
                "cmd": "kubectl rollout history deploy/NAME",
                "desc": "Rollout history"
            },
            {
                "cmd": "kubectl set image deploy/NAME c=img:v2",
                "desc": "Update image"
            }
        ]
    },
    {
        "title": "Services & Networking",
        "items": [
            {
                "cmd": "kubectl get svc",
                "desc": "List services"
            },
            {
                "cmd": "kubectl expose deploy NAME --port=80",
                "desc": "Create service"
            },
            {
                "cmd": "kubectl get endpoints NAME",
                "desc": "Service endpoints"
            },
            {
                "cmd": "kubectl get ingress",
                "desc": "List ingress rules"
            },
            {
                "cmd": "kubectl port-forward svc/NAME 8080:80",
                "desc": "Local port forward"
            },
            {
                "cmd": "kubectl get networkpolicy",
                "desc": "Network policies"
            }
        ]
    },
    {
        "title": "Config & Secrets",
        "items": [
            {
                "cmd": "kubectl get configmap",
                "desc": "List ConfigMaps"
            },
            {
                "cmd": "kubectl get secret",
                "desc": "List Secrets"
            },
            {
                "cmd": "kubectl create secret generic NAME --from-literal=k=v",
                "desc": "Create secret"
            },
            {
                "cmd": "kubectl create configmap NAME --from-file=f",
                "desc": "Create from file"
            },
            {
                "cmd": "kubectl get secret NAME -o jsonpath='{.data.key}' | base64 -d",
                "desc": "Decode secret"
            }
        ]
    },
    {
        "title": "Debugging",
        "items": [
            {
                "cmd": "kubectl describe pod NAME",
                "desc": "Events + status"
            },
            {
                "cmd": "kubectl get events --sort-by=.lastTimestamp",
                "desc": "Recent events"
            },
            {
                "cmd": "kubectl top pods",
                "desc": "CPU/memory usage"
            },
            {
                "cmd": "kubectl get pods --field-selector=status.phase=Failed",
                "desc": "Failed pods"
            },
            {
                "cmd": "kubectl run debug --image=nicolaka/netshoot -it --rm -- bash",
                "desc": "Network debug pod"
            },
            {
                "cmd": "kubectl auth can-i create pods",
                "desc": "Check permissions"
            }
        ]
    },
    {
        "title": "Contexts & Namespaces",
        "items": [
            {
                "cmd": "kubectl config get-contexts",
                "desc": "List contexts"
            },
            {
                "cmd": "kubectl config use-context NAME",
                "desc": "Switch context"
            },
            {
                "cmd": "kubectl config set-context --current --namespace=NS",
                "desc": "Set default ns"
            },
            {
                "cmd": "kubectl get ns",
                "desc": "List namespaces"
            },
            {
                "cmd": "kubectl create ns NAME",
                "desc": "Create namespace"
            }
        ]
    },
    {
        "title": "Apply & Delete",
        "items": [
            {
                "cmd": "kubectl apply -f file.yaml",
                "desc": "Create/update resource"
            },
            {
                "cmd": "kubectl delete -f file.yaml",
                "desc": "Delete resource"
            },
            {
                "cmd": "kubectl apply -k ./dir",
                "desc": "Apply kustomization"
            },
            {
                "cmd": "kubectl diff -f file.yaml",
                "desc": "Preview changes"
            },
            {
                "cmd": "kubectl delete pod --all",
                "desc": "Delete all pods"
            }
        ]
    }
];

  constructor() {
    this.seo.update({
      title: 'Kubernetes (kubectl) Cheat Sheet 2026 — Quick Reference',
      description: 'Complete Kubernetes cheat sheet: kubectl commands, pod management, deployments, services, ConfigMaps, Secrets, debugging, and cluster operations.',
      url: '/cheatsheets/kubernetes',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Cheat Sheets', url: '/cheatsheets' },
        { name: 'Kubernetes', url: '/cheatsheets/kubernetes' },
      ],
    });
  }
}
