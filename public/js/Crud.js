HTMLButtonElement.prototype.delete = (data) => {

    return new Promise((resolve, reject) => {

        let formData = data.method == 'delete' ? new FormData() : new FormData(data.form);

        if(['delete', 'put'].indexOf(data.method) != -1) formData.append("id", data.id);

        fetch(data.action, {
        method: data.method,
        body: formData
        }).then(response => response.json())
        .then(json => {
            resolve(json);
        }).catch(err => { reject(err) });
    })
}