/**
 * Data Structure Visualizer - Application Controller (Version 2.0)
 * Coordinates Multi-Language Support (C, Python, Java), CodeMirror Editor,
 * CEngine, CVisualizer, Auto-Follow Viewport Following, and Pedagogical Inspection.
 * Developer Credit: Developed by Pratiyush Jaiswal
 */

(function () {
  'use strict';

  // ==========================================================================
  // MULTI-LANGUAGE PRESET EXAMPLES LIBRARY
  // ==========================================================================

  const EXAMPLES = {
    c: {
      array_init: {
        title: "1. Array Initialization",
        group: "1. Arrays",
        code: `#include <stdio.h>

int main() {
    // Array declaration and initialization
    int arr[5] = {10, 20, 30, 40, 50};
    return 0;
}`
      },
      array_traversal: {
        title: "2. Array Traversal & Sum",
        group: "1. Arrays",
        code: `#include <stdio.h>

int main() {
    int arr[5] = {12, 24, 36, 48, 60};
    int sum = 0;

    // Traverse array and calculate sum
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }

    return 0;
}`
      },
      array_update: {
        title: "3. Array Element Update",
        group: "1. Arrays",
        code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    // In-place element update
    arr[1] = 99;
    arr[3] = arr[0] + 15;

    return 0;
}`
      },
      array_insert: {
        title: "4. Array Insertion",
        group: "1. Arrays",
        code: `#include <stdio.h>

int main() {
    int arr[6] = {10, 20, 30, 40, 50};
    int n = 5;
    int pos = 2; // Insert at index 2
    int val = 25;

    // Shift elements right to create space
    for (int i = n - 1; i >= pos; i--) {
        arr[i + 1] = arr[i];
    }

    // Insert element and increment length
    arr[pos] = val;
    n = n + 1;

    return 0;
}`
      },
      array_delete: {
        title: "5. Array Deletion",
        group: "1. Arrays",
        code: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int n = 5;
    int pos = 1; // Delete index 1 (value 20)

    // Shift elements left to fill the gap
    for (int i = pos; i < n - 1; i++) {
        arr[i] = arr[i + 1];
    }

    // Clear vacated tail and decrement length
    arr[n - 1] = 0;
    n = n - 1;

    return 0;
}`
      },
      array_min_max: {
        title: "6. Finding Minimum & Maximum",
        group: "1. Arrays",
        code: `#include <stdio.h>

int main() {
    int arr[6] = {35, 12, 89, 4, 76, 50};
    int min_val = arr[0];
    int max_val = arr[0];

    for (int i = 1; i < 6; i++) {
        if (arr[i] < min_val) {
            min_val = arr[i];
        }
        if (arr[i] > max_val) {
            max_val = arr[i];
        }
    }

    return 0;
}`
      },
      ll_create: {
        title: "7. Singly Linked List Creation",
        group: "2. Singly Linked Lists",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    struct Node* head = NULL;

    // Create first node
    struct Node* node1 = (struct Node*)malloc(sizeof(struct Node));
    node1->data = 10;
    node1->next = NULL;
    head = node1;

    // Create second node
    struct Node* node2 = (struct Node*)malloc(sizeof(struct Node));
    node2->data = 20;
    node2->next = NULL;
    head->next = node2;

    // Create third node
    struct Node* node3 = (struct Node*)malloc(sizeof(struct Node));
    node3->data = 30;
    node3->next = NULL;
    node2->next = node3;

    return 0;
}`
      },
      ll_traversal: {
        title: "8. Linked List Traversal",
        group: "2. Singly Linked Lists",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = 5;
    head->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->data = 15;
    head->next->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->next->data = 25;
    head->next->next->next = NULL;

    // Pointer traversal
    int total = 0;
    struct Node* curr = head;
    while (curr != NULL) {
        total += curr->data;
        curr = curr->next;
    }

    return 0;
}`
      },
      ll_insert: {
        title: "9. Linked List Insertion (Head)",
        group: "2. Singly Linked Lists",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    // Initial list: 20 -> 30 -> NULL
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = 20;
    head->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->data = 30;
    head->next->next = NULL;

    // Insert new node at beginning
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = 10;
    newNode->next = head;
    head = newNode;

    return 0;
}`
      },
      ll_delete: {
        title: "10. Linked List Deletion",
        group: "2. Singly Linked Lists",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    // Setup list: 10 -> 20 -> 30 -> NULL
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = 10;
    head->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->data = 20;
    head->next->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->next->data = 30;
    head->next->next->next = NULL;

    // Delete head node
    struct Node* temp = head;
    head = head->next;
    free(temp);

    return 0;
}`
      },
      stack_ops: {
        title: "11. Stack (Push & Pop)",
        group: "3. Linear Structures",
        code: `#include <stdio.h>

int main() {
    int stack[5];
    int top = -1;

    // Push 10
    top = top + 1;
    stack[top] = 10;

    // Push 20
    top = top + 1;
    stack[top] = 20;

    // Push 30
    top = top + 1;
    stack[top] = 30;

    // Pop top element
    int popped = stack[top];
    top = top - 1;

    return 0;
}`
      },
      queue_ops: {
        title: "12. Queue (Enqueue & Dequeue)",
        group: "3. Linear Structures",
        code: `#include <stdio.h>

int main() {
    int queue[5];
    int front = 0;
    int rear = 0;

    // Enqueue 10
    queue[rear] = 10;
    rear = rear + 1;

    // Enqueue 20
    queue[rear] = 20;
    rear = rear + 1;

    // Enqueue 30
    queue[rear] = 30;
    rear = rear + 1;

    // Dequeue element
    int item = queue[front];
    front = front + 1;

    return 0;
}`
      },
      bst_insert: {
        title: "13. Binary Search Tree Insertion",
        group: "4. Binary Search Tree",
        code: `#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};

int main() {
    // Root node 50
    struct TreeNode* root = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    root->val = 50;
    root->left = NULL;
    root->right = NULL;

    // Insert 30 (left child)
    struct TreeNode* leftNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    leftNode->val = 30;
    leftNode->left = NULL;
    leftNode->right = NULL;
    root->left = leftNode;

    // Insert 70 (right child)
    struct TreeNode* rightNode = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    rightNode->val = 70;
    rightNode->left = NULL;
    rightNode->right = NULL;
    root->right = rightNode;

    return 0;
}`
      },
      linear_search: {
        title: "14. Linear Search",
        group: "5. Searching & Sorting",
        code: `#include <stdio.h>

int main() {
    int arr[6] = {14, 28, 42, 56, 70, 84};
    int target = 56;
    int foundIndex = -1;

    for (int i = 0; i < 6; i++) {
        if (arr[i] == target) {
            foundIndex = i;
            break;
        }
    }

    return 0;
}`
      },
      bubble_sort: {
        title: "15. Bubble Sort",
        group: "5. Searching & Sorting",
        code: `#include <stdio.h>

int main() {
    int arr[5] = {50, 20, 40, 10, 30};
    int n = 5;

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return 0;
}`
      },
      star_triangle: {
        title: "16. Right-Angled Star Triangle",
        group: "6. Loops & Patterns",
        code: `#include <stdio.h>

int main() {
    int n = 5;

    // Row-by-row star pattern
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`
      },
      pyramid_pattern: {
        title: "17. Pyramid Pattern",
        group: "6. Loops & Patterns",
        code: `#include <stdio.h>

int main() {
    int n = 4;

    for (int i = 0; i < n; i++) {
        // Leading spaces
        for (int s = 0; s < n - i - 1; s++) {
            printf(" ");
        }
        // Symbols
        for (int j = 0; j < 2 * i + 1; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`
      },
      number_triangle: {
        title: "18. Number Triangle",
        group: "6. Loops & Patterns",
        code: `#include <stdio.h>

int main() {
    int n = 4;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d", j);
        }
        printf("\\n");
    }

    return 0;
}`
      },
      multiplication_table: {
        title: "19. Multiplication Table",
        group: "6. Loops & Patterns",
        code: `#include <stdio.h>

int main() {
    int num = 5;
    int table[6];

    for (int i = 1; i <= 6; i++) {
        table[i - 1] = num * i;
    }

    return 0;
}`
      }
    },

    python: {
      py_list_init: {
        title: "1. List Initialization & Indexing",
        group: "1. Lists & Data Structures",
        code: `# Python list initialization and access
arr = [10, 20, 30, 40, 50]
val = arr[2]
arr[1] = 99
`
      },
      py_list_traversal: {
        title: "2. List Traversal & Sum",
        group: "1. Lists & Data Structures",
        code: `# Calculate total sum of list elements
arr = [12, 24, 36, 48, 60]
total = 0

for i in range(len(arr)):
    total += arr[i]
`
      },
      py_stack: {
        title: "3. Stack Operations (LIFO)",
        group: "1. Lists & Data Structures",
        code: `# Stack operations using a Python list
stack = []

# Push elements
stack.append(10)
stack.append(20)
stack.append(30)

# Pop element
popped = stack.pop()
`
      },
      py_queue: {
        title: "4. Queue Operations (FIFO)",
        group: "1. Lists & Data Structures",
        code: `# Queue operations (FIFO) using Python list
queue = []

# Enqueue items
queue.append(10)
queue.append(20)
queue.append(30)

# Dequeue front item
item = queue.pop(0)
`
      },
      py_linked_list: {
        title: "5. Singly Linked List",
        group: "1. Lists & Data Structures",
        code: `# Singly linked list node chain
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

head = Node(10)
node2 = Node(20)
head.next = node2
node3 = Node(30)
node2.next = node3

# Pointer traversal
curr = head
total = 0
while curr:
    total += curr.data
    curr = curr.next
`
      },
      py_linear_search: {
        title: "6. Linear Search Algorithm",
        group: "2. Algorithms",
        code: `# Linear search in list
arr = [15, 30, 45, 60, 75, 90]
target = 60
found_index = -1

for i in range(len(arr)):
    if arr[i] == target:
        found_index = i
        break
`
      },
      py_bubble_sort: {
        title: "7. Bubble Sort Algorithm",
        group: "2. Algorithms",
        code: `# Bubble Sort on Python list
arr = [40, 10, 50, 20, 30]
n = len(arr)

for i in range(n - 1):
    for j in range(n - i - 1):
        if arr[j] > arr[j + 1]:
            temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
`
      },
      py_min_max: {
        title: "8. Minimum & Maximum",
        group: "2. Algorithms",
        code: `# Finding min and max in list
arr = [28, 14, 88, 7, 65, 42]
min_val = arr[0]
max_val = arr[0]

for i in range(1, len(arr)):
    if arr[i] < min_val:
        min_val = arr[i]
    if arr[i] > max_val:
        max_val = arr[i]
`
      },
      py_star_triangle: {
        title: "9. Right-Angled Star Triangle",
        group: "3. Patterns & Output",
        code: `# Star triangle row-by-row construction
n = 5
for i in range(n):
    for j in range(i + 1):
        print("*", end="")
    print()
`
      },
      py_inverted_triangle: {
        title: "10. Inverted Star Triangle",
        group: "3. Patterns & Output",
        code: `# Inverted triangle
n = 5
for i in range(n, 0, -1):
    for j in range(i):
        print("*", end="")
    print()
`
      },
      py_pyramid: {
        title: "11. Pyramid Pattern",
        group: "3. Patterns & Output",
        code: `# Pyramid with spaces and stars
n = 4
for i in range(n):
    for s in range(n - i - 1):
        print(" ", end="")
    for j in range(2 * i + 1):
        print("*", end="")
    print()
`
      },
      py_number_triangle: {
        title: "12. Number Triangle",
        group: "3. Patterns & Output",
        code: `# Number triangle pattern
n = 5
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print(j, end="")
    print()
`
      },
      py_multiplication_table: {
        title: "13. Multiplication Table",
        group: "3. Patterns & Output",
        code: `# Multiplication table generator
num = 7
for i in range(1, 7):
    prod = num * i
`
      }
    },

    java: {
      java_array_init: {
        title: "1. Array Initialization & Traversal",
        group: "1. Arrays & Data Structures",
        code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;

        for (int i = 0; i < 5; i++) {
            sum += arr[i];
        }
    }
}`
      },
      java_array_update: {
        title: "2. Array Element Update",
        group: "1. Arrays & Data Structures",
        code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};

        arr[1] = 99;
        arr[3] = arr[0] + 15;
    }
}`
      },
      java_stack: {
        title: "3. Stack Operations",
        group: "1. Arrays & Data Structures",
        code: `public class Main {
    public static void main(String[] args) {
        int[] stack = new int[5];
        int top = -1;

        // Push operations
        top++;
        stack[top] = 10;
        top++;
        stack[top] = 20;

        // Pop operation
        int popped = stack[top];
        top--;
    }
}`
      },
      java_queue: {
        title: "4. Queue Operations",
        group: "1. Arrays & Data Structures",
        code: `public class Main {
    public static void main(String[] args) {
        int[] queue = new int[5];
        int front = 0;
        int rear = 0;

        // Enqueue
        queue[rear] = 10;
        rear++;
        queue[rear] = 20;
        rear++;

        // Dequeue
        int item = queue[front];
        front++;
    }
}`
      },
      java_linear_search: {
        title: "5. Linear Search",
        group: "2. Algorithms",
        code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {15, 30, 45, 60, 75};
        int target = 45;
        int foundIndex = -1;

        for (int i = 0; i < 5; i++) {
            if (arr[i] == target) {
                foundIndex = i;
                break;
            }
        }
    }
}`
      },
      java_bubble_sort: {
        title: "6. Bubble Sort",
        group: "2. Algorithms",
        code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {50, 20, 40, 10, 30};
        int n = 5;

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`
      },
      java_star_triangle: {
        title: "7. Right-Angled Star Triangle",
        group: "3. Patterns & Output",
        code: `public class Main {
    public static void main(String[] args) {
        int n = 4;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`
      },
      java_pyramid: {
        title: "8. Pyramid Pattern",
        group: "3. Patterns & Output",
        code: `public class Main {
    public static void main(String[] args) {
        int n = 4;

        for (int i = 0; i < n; i++) {
            for (int s = 0; s < n - i - 1; s++) {
                System.out.print(" ");
            }
            for (int j = 0; j < 2 * i + 1; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`
      },
      java_number_triangle: {
        title: "9. Number Triangle",
        group: "3. Patterns & Output",
        code: `public class Main {
    public static void main(String[] args) {
        int n = 4;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j);
            }
            System.out.println();
        }
    }
}`
      }
    }
  };

  // ==========================================================================
  // APPLICATION STATE
  // ==========================================================================

  let currentLanguage = 'c';
  let cmEditor = null;
  let currentTrace = [];
  let currentStepIndex = 0;
  let isPlaying = false;
  let playIntervalTimer = null;
  let activeLineHandle = null;
  let isAutoFollowEnabled = true;

  // DOM Elements
  const dom = (typeof document !== 'undefined') ? {
    langSelect: document.getElementById('langSelect'),
    langBadge: document.getElementById('langBadge'),
    exampleSelect: document.getElementById('exampleSelect'),
    runBtn: document.getElementById('runBtn'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    editorFilename: document.getElementById('editorFilename'),
    codeEditor: document.getElementById('codeEditor'),
    activeLineBadge: document.getElementById('activeLineBadge'),
    formatBtn: document.getElementById('formatBtn'),
    errorPanel: document.getElementById('errorPanel'),
    errorMsgText: document.getElementById('errorMsgText'),
    closeErrorBtn: document.getElementById('closeErrorBtn'),

    dsTypePill: document.getElementById('dsTypePill'),
    stepCounterPill: document.getElementById('stepCounterPill'),
    resetBtn: document.getElementById('resetBtn'),
    prevBtn: document.getElementById('prevBtn'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playPauseText: document.getElementById('playPauseText'),
    playIcon: document.getElementById('playIcon'),
    pauseIcon: document.getElementById('pauseIcon'),
    nextBtn: document.getElementById('nextBtn'),
    autoFollowBtn: document.getElementById('autoFollowBtn'),
    autoFollowText: document.getElementById('autoFollowText'),
    autoFollowTextShort: document.getElementById('autoFollowTextShort'),
    stepSlider: document.getElementById('stepSlider'),
    speedSelect: document.getElementById('speedSelect'),

    explanationOp: document.getElementById('explanationOp'),
    explanationText: document.getElementById('explanationText'),
    graphicViewport: document.getElementById('graphicViewport'),

    tabVarsBtn: document.getElementById('tabVarsBtn'),
    tabInspectorBtn: document.getElementById('tabInspectorBtn'),
    tabMemoryBtn: document.getElementById('tabMemoryBtn'),
    tabConsoleBtn: document.getElementById('tabConsoleBtn'),

    tabVarsContent: document.getElementById('tabVarsContent'),
    tabInspectorContent: document.getElementById('tabInspectorContent'),
    tabMemoryContent: document.getElementById('tabMemoryContent'),
    tabConsoleContent: document.getElementById('tabConsoleContent'),

    varsTableBody: document.getElementById('varsTableBody'),
    inspectorOp: document.getElementById('inspectorOp'),
    inspectorTarget: document.getElementById('inspectorTarget'),
    inspectorVarChange: document.getElementById('inspectorVarChange'),
    inspectorPedagogy: document.getElementById('inspectorPedagogy'),

    statDsType: document.getElementById('statDsType'),
    statElemCount: document.getElementById('statElemCount'),
    statCapacity: document.getElementById('statCapacity'),
    statLine: document.getElementById('statLine'),
    consoleOutput: document.getElementById('consoleOutput'),
    consoleCharCount: document.getElementById('consoleCharCount'),

    footerActiveOp: document.getElementById('footerActiveOp'),
    footerLineCol: document.getElementById('footerLineCol'),
    tabEditorBtn: document.getElementById('tabEditorBtn'),
    tabVisualizerBtn: document.getElementById('tabVisualizerBtn'),
    tabMobileDockBtn: document.getElementById('tabMobileDockBtn'),
    editorPane: document.getElementById('editorPane'),
    visualizerPane: document.getElementById('visualizerPane'),
    mobileStepCount: document.getElementById('mobileStepCount'),
    mobileStepCountShort: document.getElementById('mobileStepCountShort'),
    mobileEditorTabLabel: document.getElementById('mobileEditorTabLabel'),

    workspaceMain: document.getElementById('workspaceMain'),
    horizontalResizer: document.getElementById('horizontalResizer'),
    verticalResizer: document.getElementById('verticalResizer'),
    maximizeEditorBtn: document.getElementById('maximizeEditorBtn'),
    maximizeVisualizerBtn: document.getElementById('maximizeVisualizerBtn'),
    maximizeDockBtn: document.getElementById('maximizeDockBtn'),
    collapseDockBtn: document.getElementById('collapseDockBtn'),
    collapseDockIcon: document.getElementById('collapseDockIcon'),
    expandDockIcon: document.getElementById('expandDockIcon'),
    infoDock: document.getElementById('infoDock'),
    vizStageContainer: document.getElementById('vizStageContainer')
  } : {};


  // ==========================================================================
  // INITIALIZATION & CODEMIRROR SETUP
  // ==========================================================================

  function initEditor() {
    if (typeof CodeMirror !== 'undefined') {
      cmEditor = CodeMirror.fromTextArea(dom.codeEditor, {
        mode: 'text/x-csrc',
        theme: 'default',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: false
      });

      cmEditor.on('cursorActivity', () => {
        const pos = cmEditor.getCursor();
        dom.activeLineBadge.textContent = `Line ${pos.line + 1}`;
        dom.footerLineCol.textContent = `Ln ${pos.line + 1}, Col ${pos.ch + 1}`;
      });

      // Recalculate editor gutter width and character sizing on initial load & layout stabilization
      const refreshCm = () => {
        if (cmEditor) cmEditor.refresh();
      };

      requestAnimationFrame(refreshCm);
      setTimeout(refreshCm, 50);
      setTimeout(refreshCm, 150);
      setTimeout(refreshCm, 300);

      // Refresh when web fonts finish downloading so metrics match Fira Code
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(refreshCm);
      }

      // Automatically refresh on container resize
      if (typeof ResizeObserver !== 'undefined' && dom.editorWrapper) {
        const ro = new ResizeObserver(() => {
          refreshCm();
        });
        ro.observe(dom.editorWrapper);
      }
    }

    // Populate Initial Examples for C
    populateExamplesDropdown('c');
    loadExample('array_init');
  }

  function getEditorCode() {
    return cmEditor ? cmEditor.getValue() : dom.codeEditor.value;
  }

  function setEditorCode(val) {
    if (cmEditor) {
      cmEditor.setValue(val);
      cmEditor.clearHistory();
    } else {
      dom.codeEditor.value = val;
    }
  }

  // --- Dynamic Example Populator ---
  function populateExamplesDropdown(lang) {
    const langExamples = EXAMPLES[lang] || {};
    dom.exampleSelect.innerHTML = '';

    // Group by category
    const groups = {};
    for (const [key, item] of Object.entries(langExamples)) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push({ key, title: item.title });
    }

    for (const [grpName, items] of Object.entries(groups)) {
      const optGroup = document.createElement('optgroup');
      optGroup.label = grpName;
      items.forEach(it => {
        const opt = document.createElement('option');
        opt.value = it.key;
        opt.textContent = it.title;
        optGroup.appendChild(opt);
      });
      dom.exampleSelect.appendChild(optGroup);
    }
  }

  // ==========================================================================
  // LANGUAGE SWITCHING CONTROLLER
  // ==========================================================================

  function switchLanguage(lang) {
    currentLanguage = lang;
    pausePlayback();
    resetState();

    let cmMode = 'text/x-csrc';
    let filename = 'main.c';
    let badgeText = 'C99';
    let footerText = 'C (Visualizer v2.0)';

    if (lang === 'python') {
      cmMode = 'text/x-python';
      filename = 'main.py';
      badgeText = 'Python 3.x';
      footerText = 'Python (Visualizer v2.0)';
    } else if (lang === 'java') {
      cmMode = 'text/x-java';
      filename = 'Main.java';
      badgeText = 'Java 17';
      footerText = 'Java (Visualizer v2.0)';
    }

    if (cmEditor) {
      cmEditor.setOption('mode', cmMode);
    }

    dom.editorFilename.textContent = filename;
    dom.langBadge.innerHTML = `<span class="badge-dot"></span> ${badgeText}`;
    dom.footerLangMode.textContent = footerText;
    if (dom.mobileEditorTabLabel) {
      dom.mobileEditorTabLabel.textContent = (typeof window !== 'undefined' && window.innerWidth <= 480) ? badgeText : `${badgeText} Editor`;
    }

    populateExamplesDropdown(lang);

    // Pick first example of the selected language
    const langKeys = Object.keys(EXAMPLES[lang] || {});
    if (langKeys.length > 0) {
      loadExample(langKeys[0]);
    }
  }

  // ==========================================================================
  // EXAMPLE LOADING
  // ==========================================================================

  function loadExample(exampleKey) {
    if (exampleKey === 'bst_intersection') exampleKey = 'bst_insert';
    const langEx = EXAMPLES[currentLanguage];
    if (langEx && langEx[exampleKey]) {
      pausePlayback();
      setEditorCode(langEx[exampleKey].code);
      resetState();
      dom.exampleSelect.value = exampleKey;
      hideError();
      updateStatus('ready', 'Example Loaded');
    }
  }

  // ==========================================================================
  // EXECUTION & RUN CODE
  // ==========================================================================

  function runCode() {
    pausePlayback();
    hideError();
    const code = getEditorCode().trim();
    if (!code) {
      showError("Validation Error: Source code cannot be empty.");
      return;
    }

    updateStatus('running', `Executing ${currentLanguage.toUpperCase()} Engine...`);

    try {
      const result = CEngine.executeCode(code, currentLanguage);

      if (!result.success) {
        showError(result.error);
        return;
      }

      currentTrace = result.trace || [];
      if (currentTrace.length === 0) {
        showError("Execution finished but produced 0 trace steps.");
        return;
      }

      currentStepIndex = 0;
      dom.stepSlider.max = currentTrace.length - 1;
      dom.stepSlider.value = 0;
      dom.stepSlider.disabled = false;

      enableControls(true);
      renderCurrentStep();
      updateStatus('ready', `Trace Complete (${currentTrace.length} steps)`);

      // Switch to visualizer tab on mobile automatically
      if (window.innerWidth <= 900) {
        switchMobileTab('visualizer');
      }
    } catch (err) {
      console.error("Execution error:", err);
      showError(`Execution Error: ${err.message}`);
    }
  }

  function enableControls(enabled) {
    dom.resetBtn.disabled = !enabled;
    dom.prevBtn.disabled = !enabled;
    dom.playPauseBtn.disabled = !enabled;
    dom.nextBtn.disabled = !enabled;
    dom.stepSlider.disabled = !enabled;
  }

  function resetState() {
    pausePlayback();
    currentTrace = [];
    currentStepIndex = 0;
    enableControls(false);
    clearActiveLineHighlight();
    dom.stepSlider.value = 0;
    dom.stepSlider.max = 0;
    dom.stepCounterPill.textContent = 'Step 0 / 0';
    if (dom.mobileStepCount) dom.mobileStepCount.textContent = '0/0';
    if (dom.mobileStepCountShort) dom.mobileStepCountShort.textContent = '0/0';
    dom.explanationOp.textContent = 'INITIALIZE';
    dom.explanationText.textContent = 'Click "Run Code" to compile and trace memory step-by-step.';
    CVisualizer.render(dom.graphicViewport, null);

    dom.varsTableBody.innerHTML = '<tr><td colspan="3" class="table-empty">No active variables</td></tr>';
    dom.inspectorOp.textContent = '—';
    dom.inspectorTarget.textContent = '—';
    dom.inspectorVarChange.textContent = '—';
    dom.inspectorPedagogy.textContent = 'Step through code to inspect state changes.';
    dom.consoleOutput.textContent = '/* Program stdout output will appear here */';
    dom.consoleCharCount.textContent = '0';
    dom.statDsType.textContent = 'None';
    dom.statElemCount.textContent = '0';
    dom.statCapacity.textContent = '0';
    dom.statLine.textContent = 'Line 0';
  }

  // ==========================================================================
  // NAVIGATION & PLAYBACK
  // ==========================================================================

  function goToStep(index) {
    if (!currentTrace || currentTrace.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(index, currentTrace.length - 1));
    currentStepIndex = clampedIndex;
    dom.stepSlider.value = clampedIndex;
    renderCurrentStep();

    if (currentStepIndex === currentTrace.length - 1 && isPlaying) {
      pausePlayback();
    }
  }

  function stepNext() {
    if (currentStepIndex < currentTrace.length - 1) {
      goToStep(currentStepIndex + 1);
    }
  }

  function stepPrev() {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }

  function togglePlayPause() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function startPlayback() {
    if (!currentTrace || currentTrace.length === 0) return;
    if (currentStepIndex >= currentTrace.length - 1) {
      currentStepIndex = 0;
    }
    isPlaying = true;
    dom.playIcon.style.display = 'none';
    dom.pauseIcon.style.display = 'inline';
    dom.playPauseText.textContent = 'Pause';

    const speed = parseInt(dom.speedSelect.value, 10) || 800;
    clearInterval(playIntervalTimer);
    playIntervalTimer = setInterval(() => {
      if (currentStepIndex < currentTrace.length - 1) {
        stepNext();
      } else {
        pausePlayback();
      }
    }, speed);
  }

  function pausePlayback() {
    isPlaying = false;
    clearInterval(playIntervalTimer);
    dom.playIcon.style.display = 'inline';
    dom.pauseIcon.style.display = 'none';
    dom.playPauseText.textContent = 'Play';
  }

  function toggleAutoFollow() {
    isAutoFollowEnabled = !isAutoFollowEnabled;
    if (isAutoFollowEnabled) {
      dom.autoFollowBtn.classList.add('toggle-active');
      if (dom.autoFollowText) dom.autoFollowText.textContent = 'Auto-Follow: ON';
      if (dom.autoFollowTextShort) dom.autoFollowTextShort.textContent = 'Auto: ON';
      CVisualizer.autoFollow(dom.graphicViewport);
    } else {
      dom.autoFollowBtn.classList.remove('toggle-active');
      if (dom.autoFollowText) dom.autoFollowText.textContent = 'Auto-Follow: OFF';
      if (dom.autoFollowTextShort) dom.autoFollowTextShort.textContent = 'Auto: OFF';
    }
  }

  // ==========================================================================
  // RENDERING ENGINE
  // ==========================================================================

  function renderCurrentStep() {
    const step = currentTrace[currentStepIndex];
    if (!step) return;

    const totalSteps = currentTrace.length;
    dom.stepCounterPill.textContent = `Step ${currentStepIndex + 1} / ${totalSteps}`;
    if (dom.mobileStepCount) dom.mobileStepCount.textContent = `${currentStepIndex + 1}/${totalSteps}`;
    if (dom.mobileStepCountShort) dom.mobileStepCountShort.textContent = `${currentStepIndex + 1}/${totalSteps}`;
    dom.dsTypePill.textContent = (step.ds_type || 'ARRAY').toUpperCase().replace(/_/g, ' ');
    dom.explanationOp.textContent = (step.operation || 'OPERATION').toUpperCase().replace(/_/g, ' ');
    dom.explanationText.textContent = step.explanation || '';
    dom.footerActiveOp.textContent = step.explanation || '';

    if (step.line_number) {
      highlightLine(step.line_number);
    }

    // 1. Render Graphic Visualization
    CVisualizer.render(dom.graphicViewport, step);

    // 2. Intelligent Auto-Follow Viewport
    if (isAutoFollowEnabled) {
      CVisualizer.autoFollow(dom.graphicViewport);
    }

    // 3. Render Information Dock (Variables, Inspector, Memory, Console)
    renderDockInfo(step);

    dom.prevBtn.disabled = (currentStepIndex === 0);
    dom.nextBtn.disabled = (currentStepIndex === totalSteps - 1);
  }

  function renderDockInfo(step) {
    // 1. Local Variables Table (Excludes unwanted variables from array pointer tags)
    const vars = step.variables || {};
    const varKeys = Object.keys(vars);
    if (varKeys.length === 0) {
      dom.varsTableBody.innerHTML = '<tr><td colspan="3" class="table-empty">No active variables</td></tr>';
    } else {
      let rows = '';
      varKeys.forEach(k => {
        const val = vars[k];
        let typeStr = 'int';
        let valStr = '';

        if (Array.isArray(val)) {
          typeStr = currentLanguage === 'python' ? 'list' : 'int[]';
          valStr = `[${val.join(', ')}]`;
        } else if (val === null) {
          typeStr = currentLanguage === 'python' ? 'None' : 'pointer';
          valStr = currentLanguage === 'python' ? 'None' : 'NULL';
        } else if (typeof val === 'string' && val.startsWith('node_')) {
          typeStr = 'Node*';
          valStr = `&${val}`;
        } else if (typeof val === 'number') {
          typeStr = 'int';
          valStr = val.toString();
        } else {
          typeStr = typeof val;
          valStr = String(val);
        }

        rows += `
          <tr>
            <td><strong>${escapeHtml(k)}</strong></td>
            <td><code>${escapeHtml(typeStr)}</code></td>
            <td><code>${escapeHtml(valStr)}</code></td>
          </tr>`;
      });
      dom.varsTableBody.innerHTML = rows;
    }

    // 2. Execution Inspector Panel
    dom.inspectorOp.textContent = (step.operation || '—').toUpperCase().replace(/_/g, ' ');
    dom.inspectorTarget.textContent = `Line ${step.line_number || '—'} (${step.ds_type || 'General'})`;
    dom.inspectorVarChange.textContent = varKeys.length > 0 ? varKeys.map(k => `${k}=${JSON.stringify(vars[k])}`).join(', ') : 'None';
    dom.inspectorPedagogy.textContent = step.explanation || 'Step through execution to inspect changes.';

    // 3. Memory Stats
    dom.statDsType.textContent = (step.ds_type || 'array').toUpperCase().replace(/_/g, ' ');
    if (step.memory_state.elements) {
      dom.statElemCount.textContent = step.memory_state.length !== undefined ? step.memory_state.length : step.memory_state.elements.length;
      dom.statCapacity.textContent = step.memory_state.capacity || 'Dynamic';
    } else if (step.memory_state.nodes) {
      dom.statElemCount.textContent = step.memory_state.nodes.length;
      dom.statCapacity.textContent = 'Dynamic Heap';
    } else if (step.memory_state.grid) {
      dom.statElemCount.textContent = step.memory_state.grid.length;
      dom.statCapacity.textContent = 'Pattern Matrix';
    }
    dom.statLine.textContent = `Line ${step.line_number || 0}`;

    // 4. Console Output
    const stdout = step.stdout || '';
    dom.consoleOutput.textContent = stdout ? stdout : '/* (No output generated yet) */';
    dom.consoleCharCount.textContent = stdout.length;
  }

  // --- Source Line Highlighting ---
  function highlightLine(lineNum) {
    if (!cmEditor) return;
    clearActiveLineHighlight();
    const docLine = Math.max(0, lineNum - 1);
    if (docLine < cmEditor.lineCount()) {
      activeLineHandle = cmEditor.addLineClass(docLine, 'background', 'cm-active-trace-line');
      cmEditor.scrollIntoView({ line: docLine, ch: 0 }, 60);
    }
  }

  function clearActiveLineHighlight() {
    if (cmEditor && activeLineHandle) {
      cmEditor.removeLineClass(activeLineHandle, 'background', 'cm-active-trace-line');
      activeLineHandle = null;
    }
  }

  // --- UI Tabs & Dock Controls ---
  function switchDockTab(tabId) {
    dom.tabVarsBtn.classList.remove('active');
    dom.tabInspectorBtn.classList.remove('active');
    dom.tabMemoryBtn.classList.remove('active');
    dom.tabConsoleBtn.classList.remove('active');

    dom.tabVarsContent.classList.remove('active');
    dom.tabInspectorContent.classList.remove('active');
    dom.tabMemoryContent.classList.remove('active');
    dom.tabConsoleContent.classList.remove('active');

    if (tabId === 'vars') {
      dom.tabVarsBtn.classList.add('active');
      dom.tabVarsContent.classList.add('active');
    } else if (tabId === 'inspector') {
      dom.tabInspectorBtn.classList.add('active');
      dom.tabInspectorContent.classList.add('active');
    } else if (tabId === 'memory') {
      dom.tabMemoryBtn.classList.add('active');
      dom.tabMemoryContent.classList.add('active');
    } else if (tabId === 'console') {
      dom.tabConsoleBtn.classList.add('active');
      dom.tabConsoleContent.classList.add('active');
    }
  }

  function switchMobileTab(tab) {
    if (!dom.tabEditorBtn || !dom.tabVisualizerBtn) return;
    dom.tabEditorBtn.classList.remove('active');
    dom.tabVisualizerBtn.classList.remove('active');
    if (dom.tabMobileDockBtn) dom.tabMobileDockBtn.classList.remove('active');

    if (tab === 'editor') {
      dom.tabEditorBtn.classList.add('active');
      dom.editorPane.classList.add('mobile-active');
      dom.visualizerPane.classList.remove('mobile-active');
      if (cmEditor) cmEditor.refresh();
    } else if (tab === 'dock') {
      if (dom.tabMobileDockBtn) dom.tabMobileDockBtn.classList.add('active');
      dom.visualizerPane.classList.add('mobile-active');
      dom.editorPane.classList.remove('mobile-active');
      if (dom.infoDock) dom.infoDock.classList.remove('dock-collapsed');
      setTimeout(() => {
        if (dom.infoDock) {
          dom.infoDock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      // visualizer
      dom.tabVisualizerBtn.classList.add('active');
      dom.visualizerPane.classList.add('mobile-active');
      dom.editorPane.classList.remove('mobile-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Trigger viewport auto-follow when visualizer becomes visible
      if (isAutoFollowEnabled) {
        setTimeout(() => CVisualizer.autoFollow(dom.graphicViewport), 50);
      }
    }
  }

  // ==========================================================================
  // DYNAMIC WORKSPACE RESIZING & MAXIMIZE CONTROLLERS (VS Code / Antigravity Style)
  // ==========================================================================

  let isMaximizedEditor = false;
  let isMaximizedVisualizer = false;
  let isMaximizedDock = false;
  let isCollapsedDock = false;

  function initWorkspaceResizers() {
    if (!dom.workspaceMain || !dom.horizontalResizer || !dom.verticalResizer) return;

    // Restore saved layout if on desktop
    const isDesktop = (typeof window !== 'undefined' && window.innerWidth > 900);
    if (isDesktop) {
      try {
        const savedEditorW = localStorage.getItem('dsa_ide_editor_width');
        if (savedEditorW && dom.editorPane) {
          const w = parseInt(savedEditorW, 10);
          if (w >= 200 && w <= window.innerWidth - 260) {
            dom.editorPane.style.width = `${w}px`;
            document.documentElement.style.setProperty('--editor-width', `${w}px`);
          }
        }
        const savedDockH = localStorage.getItem('dsa_ide_dock_height');
        if (savedDockH && dom.infoDock) {
          const h = parseInt(savedDockH, 10);
          if (h >= 32 && h <= 500) {
            dom.infoDock.style.height = `${h}px`;
            document.documentElement.style.setProperty('--dock-height', `${h}px`);
          }
        }
      } catch (err) {
        // localStorage unavailable
      }
    }

    // 1. Horizontal Resizer (Editor <-> Visualizer)
    let isDraggingH = false;
    let startX = 0;
    let startWidth = 0;

    function onPointerDownH(e) {
      if (window.innerWidth <= 900) return;
      isDraggingH = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startWidth = dom.editorPane.getBoundingClientRect().width;
      document.body.classList.add('resizing-h');
      dom.horizontalResizer.classList.add('is-dragging');
      e.preventDefault();
    }

    function onPointerMoveH(e) {
      if (!isDraggingH) return;
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const mainRect = dom.workspaceMain.getBoundingClientRect();
      const minW = 200;
      const maxW = Math.max(minW + 50, mainRect.width - 260);
      let newW = startWidth + (currentX - startX);
      newW = Math.max(minW, Math.min(newW, maxW));

      dom.editorPane.style.width = `${newW}px`;
      document.documentElement.style.setProperty('--editor-width', `${newW}px`);
      if (cmEditor) cmEditor.refresh();
      e.preventDefault();
    }

    function onPointerUpH() {
      if (!isDraggingH) return;
      isDraggingH = false;
      document.body.classList.remove('resizing-h');
      dom.horizontalResizer.classList.remove('is-dragging');
      if (cmEditor) cmEditor.refresh();
      if (isAutoFollowEnabled) CVisualizer.autoFollow(dom.graphicViewport);

      try {
        const finalW = Math.round(dom.editorPane.getBoundingClientRect().width);
        localStorage.setItem('dsa_ide_editor_width', finalW);
      } catch (err) {}
    }

    dom.horizontalResizer.addEventListener('mousedown', onPointerDownH);
    dom.horizontalResizer.addEventListener('touchstart', onPointerDownH, { passive: false });
    window.addEventListener('mousemove', onPointerMoveH, { passive: false });
    window.addEventListener('touchmove', onPointerMoveH, { passive: false });
    window.addEventListener('mouseup', onPointerUpH);
    window.addEventListener('touchend', onPointerUpH);

    // Double-click on horizontal resizer resets to 50/50 split
    dom.horizontalResizer.addEventListener('dblclick', () => {
      if (window.innerWidth <= 900) return;
      const mainRect = dom.workspaceMain.getBoundingClientRect();
      const halfW = Math.round((mainRect.width - 6) / 2);
      dom.editorPane.style.width = `${halfW}px`;
      document.documentElement.style.setProperty('--editor-width', `${halfW}px`);
      if (cmEditor) cmEditor.refresh();
      try { localStorage.setItem('dsa_ide_editor_width', halfW); } catch (err) {}
    });

    // 2. Vertical Resizer (Graphic Viewport <-> Bottom Dock)
    let isDraggingV = false;
    let startY = 0;
    let startHeight = 0;

    function onPointerDownV(e) {
      if (window.innerWidth <= 900) return;
      isDraggingV = true;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      startHeight = dom.infoDock.getBoundingClientRect().height;
      document.body.classList.add('resizing-v');
      dom.verticalResizer.classList.add('is-dragging');
      e.preventDefault();
    }

    function onPointerMoveV(e) {
      if (!isDraggingV) return;
      const currentY = e.touches ? e.touches[0].clientY : e.clientY;
      const vizRect = dom.visualizerPane.getBoundingClientRect();
      const minH = 32;
      const maxH = Math.max(minH + 50, vizRect.height - 120);
      let newH = startHeight - (currentY - startY);
      newH = Math.max(minH, Math.min(newH, maxH));

      dom.infoDock.style.height = `${newH}px`;
      document.documentElement.style.setProperty('--dock-height', `${newH}px`);
      e.preventDefault();
    }

    function onPointerUpV() {
      if (!isDraggingV) return;
      isDraggingV = false;
      document.body.classList.remove('resizing-v');
      dom.verticalResizer.classList.remove('is-dragging');
      if (isAutoFollowEnabled) CVisualizer.autoFollow(dom.graphicViewport);

      try {
        const finalH = Math.round(dom.infoDock.getBoundingClientRect().height);
        localStorage.setItem('dsa_ide_dock_height', finalH);
      } catch (err) {}
    }

    dom.verticalResizer.addEventListener('mousedown', onPointerDownV);
    dom.verticalResizer.addEventListener('touchstart', onPointerDownV, { passive: false });
    window.addEventListener('mousemove', onPointerMoveV, { passive: false });
    window.addEventListener('touchmove', onPointerMoveV, { passive: false });
    window.addEventListener('mouseup', onPointerUpV);
    window.addEventListener('touchend', onPointerUpV);

    // Double click on vertical resizer toggles collapse/restore
    dom.verticalResizer.addEventListener('dblclick', toggleCollapseDock);
  }

  // --- Maximize & Collapse Helpers ---
  function toggleMaximizeEditor() {
    isMaximizedEditor = !isMaximizedEditor;
    if (isMaximizedVisualizer) {
      isMaximizedVisualizer = false;
      dom.visualizerPane.classList.remove('pane-maximized', 'pane-hidden');
    }

    if (isMaximizedEditor) {
      dom.editorPane.classList.add('pane-maximized');
      dom.visualizerPane.classList.add('pane-hidden');
      dom.horizontalResizer.classList.add('gutter-hidden');
      updateMaximizeIcon(dom.maximizeEditorBtn, true);
    } else {
      dom.editorPane.classList.remove('pane-maximized');
      dom.visualizerPane.classList.remove('pane-hidden');
      dom.horizontalResizer.classList.remove('gutter-hidden');
      updateMaximizeIcon(dom.maximizeEditorBtn, false);
    }
    if (cmEditor) cmEditor.refresh();
  }

  function toggleMaximizeVisualizer() {
    isMaximizedVisualizer = !isMaximizedVisualizer;
    if (isMaximizedEditor) {
      isMaximizedEditor = false;
      dom.editorPane.classList.remove('pane-maximized', 'pane-hidden');
    }

    if (isMaximizedVisualizer) {
      dom.visualizerPane.classList.add('pane-maximized');
      dom.editorPane.classList.add('pane-hidden');
      dom.horizontalResizer.classList.add('gutter-hidden');
      updateMaximizeIcon(dom.maximizeVisualizerBtn, true);
    } else {
      dom.visualizerPane.classList.remove('pane-maximized');
      dom.editorPane.classList.remove('pane-hidden');
      dom.horizontalResizer.classList.remove('gutter-hidden');
      updateMaximizeIcon(dom.maximizeVisualizerBtn, false);
    }
    if (isAutoFollowEnabled) CVisualizer.autoFollow(dom.graphicViewport);
  }

  function toggleCollapseDock() {
    isCollapsedDock = !isCollapsedDock;
    if (isCollapsedDock) {
      dom.infoDock.classList.add('dock-collapsed');
      if (dom.collapseDockIcon) dom.collapseDockIcon.style.display = 'none';
      if (dom.expandDockIcon) dom.expandDockIcon.style.display = 'inline';
    } else {
      dom.infoDock.classList.remove('dock-collapsed');
      if (dom.collapseDockIcon) dom.collapseDockIcon.style.display = 'inline';
      if (dom.expandDockIcon) dom.expandDockIcon.style.display = 'none';
    }
    if (isAutoFollowEnabled) CVisualizer.autoFollow(dom.graphicViewport);
  }

  function toggleMaximizeDock() {
    isMaximizedDock = !isMaximizedDock;
    if (isMaximizedDock) {
      dom.infoDock.classList.add('dock-maximized');
      dom.infoDock.classList.remove('dock-collapsed');
    } else {
      dom.infoDock.classList.remove('dock-maximized');
    }
    if (isAutoFollowEnabled) CVisualizer.autoFollow(dom.graphicViewport);
  }

  function updateMaximizeIcon(btn, isMax) {
    if (!btn) return;
    const maxIcon = btn.querySelector('.maximize-icon');
    const restoreIcon = btn.querySelector('.restore-icon');
    if (maxIcon) maxIcon.style.display = isMax ? 'none' : 'inline';
    if (restoreIcon) restoreIcon.style.display = isMax ? 'inline' : 'none';
  }

  function updateStatus(state, message) {
    dom.statusDot.className = `status-dot ${state}`;
    dom.statusText.textContent = message;
    dom.footerActiveOp.textContent = message;
  }

  function showError(msg) {
    dom.errorPanel.style.display = 'block';
    dom.errorMsgText.textContent = msg;
    updateStatus('error', 'Execution Error');
    if (window.innerWidth <= 900) {
      switchMobileTab('editor');
    }
  }

  function hideError() {
    dom.errorPanel.style.display = 'none';
    dom.errorMsgText.textContent = '';
  }

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  function setupEventListeners() {
    dom.runBtn.addEventListener('click', runCode);

    dom.langSelect.addEventListener('change', (e) => {
      switchLanguage(e.target.value);
    });

    dom.formatBtn.addEventListener('click', () => {
      loadExample(dom.exampleSelect.value);
    });

    dom.exampleSelect.addEventListener('change', (e) => {
      loadExample(e.target.value);
    });

    dom.closeErrorBtn.addEventListener('click', hideError);

    dom.resetBtn.addEventListener('click', () => goToStep(0));
    dom.prevBtn.addEventListener('click', stepPrev);
    dom.nextBtn.addEventListener('click', stepNext);
    dom.playPauseBtn.addEventListener('click', togglePlayPause);
    dom.autoFollowBtn.addEventListener('click', toggleAutoFollow);

    dom.stepSlider.addEventListener('input', (e) => {
      goToStep(parseInt(e.target.value, 10));
    });

    dom.speedSelect.addEventListener('change', () => {
      if (isPlaying) startPlayback();
    });

    dom.tabVarsBtn.addEventListener('click', () => switchDockTab('vars'));
    dom.tabInspectorBtn.addEventListener('click', () => switchDockTab('inspector'));
    dom.tabMemoryBtn.addEventListener('click', () => switchDockTab('memory'));
    dom.tabConsoleBtn.addEventListener('click', () => switchDockTab('console'));

    dom.tabEditorBtn.addEventListener('click', () => switchMobileTab('editor'));
    dom.tabVisualizerBtn.addEventListener('click', () => switchMobileTab('visualizer'));
    if (dom.tabMobileDockBtn) {
      dom.tabMobileDockBtn.addEventListener('click', () => switchMobileTab('dock'));
    }

    if (dom.maximizeEditorBtn) dom.maximizeEditorBtn.addEventListener('click', toggleMaximizeEditor);
    if (dom.maximizeVisualizerBtn) dom.maximizeVisualizerBtn.addEventListener('click', toggleMaximizeVisualizer);
    if (dom.collapseDockBtn) dom.collapseDockBtn.addEventListener('click', toggleCollapseDock);
    if (dom.maximizeDockBtn) dom.maximizeDockBtn.addEventListener('click', toggleMaximizeDock);

    initWorkspaceResizers();

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        return;
      }

      const isEditorFocused = cmEditor ? cmEditor.hasFocus() : (document.activeElement === dom.codeEditor);
      if (isEditorFocused) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStep(0);
      }
    });

    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      dom.editorPane.classList.add('mobile-active');
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      initEditor();
      setupEventListeners();
    });
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { EXAMPLES };
  }
})();

