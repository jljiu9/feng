<script setup>
import { ref, onMounted } from 'vue'
import TreeItem from './TreeItem.vue'
const treeData = ref({})
let cl = (str) => console.log(str)
const msg = ref('Hello World!')
let style = ref({
    'user-select': 'none'
})
const emit = defineEmits(['fileTree'])
onMounted(() => {
    async function handleEvent(event) {
        event.preventDefault()
        let webkitResult = []
        let files = event.dataTransfer.items || event.dataTransfer.files;
        let handleEntries = (entry) => "webkitGetAsEntry" in entry ? entry.webkitGetAsEntry() : entry
        let tree = {
            name:'Jljiuの',
            folder:[],
            children:[]
        }
        let folder = tree.name
        function handleFile(entry, treefile) {
            return new Promise(function (resolve) {
                if (entry.isFile) {
                    entry.file(function (file) {
                        webkitResult.push(file);
                        resolve(webkitResult);
                        let name = entry.name
                        treefile.children.push({ name: name,file:file })
                    });
                } else if (entry.isDirectory) {
                    var reader = entry.createReader();
                    reader.readEntries((entries) => {
                        let entriesPromises = [];
                        let name = entry.name
                        treefile.children.push({ name: name, children: [] })
                        folder = folder+'/'+name
                        let f = {}
                        f[`${folder}`] = treefile.children.find(x => x.name == entry.name).children
                        tree.folder.push(f)
                        for (let entr of entries) {
                            entriesPromises.push(
                                handleFile(entr, treefile.children.find(x => x.name == entry.name))
                            );
                        }
                        resolve(Promise.all(entriesPromises));
                    });
                }
            });
        }
        function processFiles(files) {
            let entriesPromises = [];
            for (let file of files) entriesPromises.push(handleFile(handleEntries(file), tree));
            Promise.all(entriesPromises)
                .then(function () {
                    console.log("complete drop", webkitResult);
                    treeData.value = tree
                    console.log(tree)
                    emit('fileTree',tree)
                    return tree
                })
                .catch(function (err) {
                    alert(err.message);
                });
        }
        if (files) {
            processFiles(files);
        }
    }
    var dropZone = document.querySelector(".dropZone");
    cl(dropZone)
    dropZone.addEventListener("drop", handleEvent, false);
    // var inputFolder = document.querySelector(".inputFolder");
    // inputFolder.addEventListener("change", function (event) {
    //     var files = event.target.files;
    //     Array.from(files, (x) => {
    //         let p = document.createElement('p')
    //         p.innerText = x.name
    //         p.setAttribute('draggable', 'true')
    //         p.isFile = x
    //         document.querySelector('.drag_container').appendChild(p)
    //     })
    // }
    // );

    let item
    document.onmousedown = e => {
        console.log(e.target.localName)
        //if(e.button == 0 && (e.target.localName == 'h1'||e.target.localName == 'h2')) 
        //e.target.style.userSelect = 'all'
    }
    document.onmouseup = e => {
        e.target.style.userSelect = 'none'
    }
    document.ondrag = e => {
        //console.log('hi')
        //e.target.style.userSelect ='all'
    }
    document.ondragover = e => {
        e.preventDefault()	//阻止默认事件，才可放置元素
    }

    document.ondragstart = e => {
        item = e.target
        e.target.style.opacity = .5
        // console.log('开始！')
    }
    // document.ondragenter = e => {
    //     console.log(e)
    //     var files = e.dataTransfer.items || e.dataTransfer.files;
    //     console.log(files[0])
    //     if (e.target.className == 'drop_container' || e.target.className == 'drag_container') {
    //         e.target.style.borderColor = 'red'
    //     }
    // }
    document.ondragleave = e => {
        if (e.target.className == 'drop_container' || e.target.className == 'drag_container') {
            e.target.style.borderColor = ''
        }
        // console.log('离开')
    }
    document.ondragend = e => {
        // console.log('结束！')
        e.target.style.opacity = ''
        console.log(e.target.parentNode)
        e.target.parentNode.style.userSelect = 'none'
    }
    document.ondrop = e => {
        e.preventDefault()
        // cl(e.dataTransfer.files)
        if (e.dataTransfer.files.length == 0) {
            e.target.style.borderColor = ''
            e.target.appendChild(item)
        } else {
            e.target.style.borderColor = ''
            Array.from(e.dataTransfer.files, (x) => {
                let p = document.createElement('p')
                p.innerText = x.name
                p.setAttribute('draggable', 'true')
                // p.setAttribute('contenteditable', 'true')
                p.isFile = x
                e.target.appendChild(p)
            })

        }
        // console.log('放置！')
    }
    // document.querySelector('h1').oncontextmenu = e => e.preventDefault()
})
</script>

<template>
    <div class="xxv">
        <div class="dropZone" >
            Drop Zone
            <!-- <input class="inputFolder" type="file" webkitdirectory multiple> -->
        </div>


        <div class='drag_container' draggable>
            <h1 draggable='true'>{{ msg }}</h1>
            <h2 draggable='true'>
                jdksdjs
            </h2>
            <div style='color:red;background-color:#7d4;user-select:none' draggable='true'>
                jjsas
            </div>
            <ul>
                <TreeItem class="item" :model="treeData"></TreeItem>
            </ul>
        </div>
        <div class="drop_container">
        </div>
    </div>
</template>

<style>
.xxv {
    height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 -20px;
}

.dropZone {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 200px;
    height: 200px;
    border: 2px solid #4cf;
    margin: 20px;
}

.drag_container {
    border: 2px solid #4cf;
    width: 200px;
    height: 400px;
    margin: 20px;
}

.drop_container {
    border: 2px solid #4cf;
    width: 200px;
    height: 400px;
    margin: 20px;
}
</style>