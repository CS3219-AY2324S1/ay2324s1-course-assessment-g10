import requests
import json
import sys

# source using https://github.com/stevenhalim/cpbook-code (CP4 Free Source Code Project)
baseRAW = "https://raw.githubusercontent.com/stevenhalim/cpbook-code/master/"

# maps topic name to (template c++, template python, template java)
cpp_template: list[str, str] = []
py_template: list[str, str] = []
java_template: list[str, str] = []

def getTemplate(name: str, path: str):
    cpp_path = baseRAW + path + ".cpp"
    py_path = baseRAW + path + ".py"
    java_path = baseRAW + path + ".java"
    cpp = requests.get(cpp_path)
    py = requests.get(py_path)
    java = requests.get(java_path)
    if (cpp.ok):
        cpp_template.append([name, f"//SOURCE: {cpp_path}\n{cpp.text}"])
    if (py.ok):
        py_template.append([name, f"#SOURCE: {py_path}\n{py.text}"])
    if (java.ok):
        java_template.append([name, f"//SOURCE: {java_path}\n{java.text}"])

topics = [
    ("AVL Tree", "ch2/nonlineards/AVL"),
    ("Quick Select", "ch2/nonlineards/QuickSelect"),
    ("Fenwick Tree", "ch2/ourown/fenwicktree_ds"),    
    ("Segment Tree", "ch2/ourown/segmenttree_ds"),
    ("Union Find", "ch2/ourown/unionfind_ds"),
    ("Floyd Warshall (APAP)", "ch4/floyd_warshall"),
    ("MCBM", "ch4/mcbm"),
    ("Hierholzer", "ch4/hierholzer"),
    ("Kruskal (MST)", "ch4/mst/kruskal"),
    ("Prim (MST)", "ch4/mst/prim"),
    ("Bellman Ford (SSSP)", "ch4/sssp/bellman_ford"),
    ("Dijkstra (SSSP)", "ch4/sssp/dijkstra"),
    ("BFS (SSSP)", "ch4/sssp/bfs"),
    ("Toposort", "ch4/traversal/toposort"),
    ("Trie", "ch6/Trie"),
    ("Max flow / Min Cut", "ch8/maxflow"),
    ("Min Cost Max Flow", "ch9/mcmf")
]


for topic in topics:
    print("Downloading topic: ", topic[0])
    getTemplate(*topic)

cpp_default="""#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    cout << "Hello world!\n";
}
"""

java_default="""public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}
"""

python_default="""print('Hello world!')"""

jsonobj = {
    "c++17": {
        "repr": "C++ 17",
        "default": cpp_default,
        "template": cpp_template
    },
    "python3": {
        "repr": "Python 3",
        "default": python_default,
        "template": py_template
    },
    "java": {
        "repr": "Java",
        "default": java_default,
        "template": java_template
    }
}

jsonPath = "lang_temps.json"

if len(sys.argv) > 1:
    jsonPath = sys.argv[1]

with open(jsonPath, "w+") as f:
    json.dump(jsonobj, f, indent=4)
