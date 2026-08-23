export interface IdeExtensionManifest {
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  engines: {
    vscode: string;
  };
  categories: string[];
  activationEvents: string[];
  main: string;
  contributes: {
    viewsContainers: {
      activitybar: Array<{
        id: string;
        title: string;
        icon: string;
      }>;
    };
    views: {
      [containerId: string]: Array<{
        type: string;
        id: string;
        name: string;
      }>;
    };
    commands: Array<{
      command: string;
      title: string;
      category: string;
    }>;
  };
}

/**
 * Generates the official VS Code / Antigravity IDE Extension package.json manifest.
 */
export function generateIdeExtensionManifest(): IdeExtensionManifest {
  return {
    name: "nexus-devflow-studio",
    displayName: "Nexus-DevFlow Studio",
    description: "Interactive 3-Pillars Kanban Dashboard, Dynamic Spec Manager & Quality Gatekeeper for Nexus-DevFlow",
    version: "2.0.27",
    publisher: "jakkrichm",
    engines: {
      vscode: "^1.80.0"
    },
    categories: ["Programming Languages", "Other", "Linters"],
    activationEvents: ["onView:nexusDevFlowStudioView", "onCommand:nexusDevFlow.openStudio"],
    main: "./out/extension.js",
    contributes: {
      viewsContainers: {
        activitybar: [
          {
            id: "nexus-devflow-container",
            title: "Nexus-DevFlow",
            icon: "resources/devflow-icon.svg"
          }
        ]
      },
      views: {
        "nexus-devflow-container": [
          {
            type: "webview",
            id: "nexusDevFlowStudioView",
            name: "DevFlow Studio"
          }
        ]
      },
      commands: [
        {
          command: "nexusDevFlow.openStudio",
          title: "Open DevFlow Studio Webview",
          category: "Nexus-DevFlow"
        },
        {
          command: "nexusDevFlow.checkGate",
          title: "Run Quality Gatekeeper Check",
          category: "Nexus-DevFlow"
        },
        {
          command: "nexusDevFlow.detectDrift",
          title: "Detect Git Diff Drift",
          category: "Nexus-DevFlow"
        },
        {
          command: "nexusDevFlow.reconcileState",
          title: "Auto-Heal & Reconcile State",
          category: "Nexus-DevFlow"
        }
      ]
    }
  };
}
