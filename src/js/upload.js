import SparkMD5 from 'spark-md5'
const cl = (str) => console.log(str)
const el = (str) => document.getElementById(str)
const elName = (str) => document.getElementsByClassName(str)
const selector = (str) => document.querySelector(str)
let upload, file, fileId, md5, size, filenum = 0, getFile = el("upload"), drop = ''
let getRtnJson = async (url, header) => {
    const response = await fetch(url, {
        method: 'get',
        headers: header,
    });
    let json = await response.json();
    return json
}
let postRtnJson = async (url, body, header) => {
    const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: header,
    });
    let json = await response.json();
    return json
}
const formatFileSize = function (bytes) {
    const sufixes = ['B', 'kB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
}
let wait = ms => new Promise((s) => setTimeout(s, ms))
async function uploadFile() {

    console.log(getFile)
    console.log(drop)
    if (drop == '') {
        drop = getFile.files
        file = drop[filenum]
        cl(file)
    } else {
        file = drop[filenum];
    }
    cl(file.name + " | " + formatFileSize(file.size) + " | " + file.type)
    try {
        if (window.currentUploadFile.value.type == 'video') {
            window.currentUploadFile.value = {
                name: window.currentUploadFile.value.name,
                type: 'image',
                size: window.currentUploadFile.value.size,
                file: window.currentUploadFile.value.file,
                time:(new Date()).toLocaleDateString()
            }
            await wait(1)
        }
    } catch (error) {
        console.log(error)
    }
    window.currentUploadFile.value = {
        name: file.name,
        type: file.type.split('/')[0],
        size: formatFileSize(file.size),
        file: window.URL.createObjectURL(file),
        time:(new Date()).toLocaleDateString()
    }
    cl(window.currentUploadFile.value)
    // setInterval(() => {
    //     window.percentage.value = (window.percentage.value % 100) + 1
    // }, 500)
    // return

    // fetch('').then(x => console.log(x))
    console.log({
        name: file.name,
        size: file.size,
        type: file.type
    })
    upload = await postRtnJson('/api/upload', {
        name: file.name,
        size: file.size,
        type: file.type
    })
    cl(upload)

    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("PUT", upload.put);
    ajax.setRequestHeader('x-amz-tagging', upload.header['x-amz-tagging'])
    get_md5(ajax)
    ajax.send(file);

    el('stop').addEventListener('click', () => ajax.abort())
    el('continue').addEventListener('click', () => {
        ajax.upload.addEventListener("progress", progressHandler, false);
        ajax.addEventListener("load", completeHandler, false);
        ajax.addEventListener("error", errorHandler, false);
        ajax.addEventListener("abort", abortHandler, false);
        ajax.open("PUT", upload.put);
        ajax.setRequestHeader('x-amz-tagging', upload.header['x-amz-tagging'])
        ajax.send(file);
    })
}

function progressHandler(event) {
    size = formatFileSize(event.total)
    // el("loaded_n_total").innerHTML = "Uploaded " + formatFileSize(event.loaded) + " of " + size;
    var percent = (event.loaded / event.total) * 100;
    window.percentage.value = Math.round(percent);
    // el("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
}

async function completeHandler(event) {
    // el("status").innerHTML = event.target.responseText;
    window.percentage.value = 0; //wil clear progress bar after successful upload
    await postRtnJson('/api/setmd5', {
        md5: md5,
        id: fileId,
        name: file.name,
        path: decodeURI(window.location.pathname.replaceAll('/', `\\`)),
        time: (new Date()).toLocaleString()
    })
    filenum = filenum + 1
    cl(filenum + '/' + drop.length)
    // let createEl = (str) => {
    //     let tag = document.createElement('h6')
    //     tag.innerText = filenum + '.' + str
    //     el("uploaded").appendChild(tag)
    //     return tag
    // }
    // createEl(file.name)
    let type
    let mm = file.type.split('/')[0]
    if (mm !== 'video' && mm !== 'image') {
        type = 'another'
    } else {
        type = mm
    }
    let info = {
        file: upload.get,
        type: type,
        size: formatFileSize(file.size),
        path: window.location.pathname,
        md5: md5,
        upload: '',
        name: file.name
    }
    window.uploaded.unshift(info)
    if (window.userFiles.value[window.currentPath.value].wrong !== 0) {
        window.userFiles.value[window.currentPath.value].unshift(info)
        window.sortIt(userFiles.value[currentPath.value])
    }else{
        window.userFiles.value[window.currentPath.value] = [info]
    }

    if (drop.length > filenum) {
        await wait(700)
        uploadFile()
    } else {
        // location.reload()
    }
}

function errorHandler(event) {
    selector(".el-progress__text span").innerHTML = "上传失败！";
}

function abortHandler(event) {
    selector(".el-progress__text span").innerHTML = "暂停上传！";
}

function get_md5(ajax) {
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        // file = getFile.files[filenum],
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    fileReader.onload = async function (e) {
        // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result);                   // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            md5 = spark.end()
            fileId = upload.url.match(/(?<=secure.notion-static.com\/)[A-Za-z0-9-]+(?!\/)/)[0]
            // window.md5List.value[window.location.pathname.replaceAll('/', `\\`)]
            await postRtnJson('/api/checkmd5', {
                md5: md5,
                id: fileId,
                name: file.name,
                path: decodeURI(window.location.pathname),
                paths: window.paths.value.reverse(),
                time: (new Date()).toLocaleString()
            }).then(async x => {
                if (x.exist) {
                    ajax.abort()
                    setTimeout(() => {
                        selector(".el-progress__text span").innerHTML = "100%";
                    }, 5);

                    window.percentage.value = 100
                    // el("status").innerHTML = "秒传！"
                    // el("loaded_n_total").innerHTML = "Uploaded " + size + " of " + size
                    cl(el("upload").files.length)
                    filenum = filenum + 1
                    cl(filenum + '/' + drop.length)
                    // let createEl = (str) => {
                    //     let tag = document.createElement('h6')
                    //     tag.innerText = filenum + '.' + str
                    //     el("uploaded").insertBefore(tag)
                    //     return tag
                    // }
                    // createEl(file.name)
                    let type
                    let mm = file.type.split('/')[0]
                    if (mm !== 'video' && mm !== 'image') {
                        type = 'another'
                    } else {
                        type = mm
                    }
                    let info = {
                        file: currentUploadFile.value.file,
                        type: type,
                        size: formatFileSize(file.size),
                        path: window.location.pathname,
                        md5: md5,
                        upload: '秒',
                        name: file.name,
                        time:(new Date()).toLocaleDateString()
                    }
                    window.uploaded.unshift(info)
                    if (window.userFiles.value[window.currentPath.value].wrong !== 0) {
                        window.userFiles.value[window.currentPath.value].unshift(info)
                        window.sortIt(userFiles.value[currentPath.value])
                    }else{
                        window.userFiles.value[window.currentPath.value] = [info]
                    }
                    if (drop.length > filenum) {
                        await wait(700)
                        uploadFile()
                    } else {
                        // location.reload()
                    }
                }
            })
            console.log('finished loading');
            console.info('computed hash', md5);  // Compute hash

        }
    };

    fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
};

window.onload = (e) => {
    el('upload').addEventListener('change', e => {
        filenum = 0
        getFile = el("upload")
        cl('change')
        drop = ''
        uploadFile()
    })
    document.querySelector('.dropbox').ondragover = function (e) {
        this.classList.add('is-dragover')
    }
    document.querySelector('.dropbox').ondragleave = function (e) {
        this.classList.remove('is-dragover')
    }
    document.querySelector('.dropbox').onclick = function (e) {
        el("upload").click()
    }
    document.querySelector('.dropbox').ondrop = function (e) {
        this.classList.remove('is-dragover')
        e.preventDefault()
        drop = e.dataTransfer.files
        console.log(drop)
        // console.log(e.dataTransfer.files)
        filenum = 0
        uploadFile()
    }
    document.ondragover = e => {
        e.preventDefault()	//阻止默认事件，才可放置元素
    }
}