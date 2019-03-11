class HcodeGrid {
    constructor(config){ 
        
        this._config = config;
        this.dataUpdate;

        this.init();
        this.show();
        this.delete();
    }

    init() {
            
        let forms = document.querySelectorAll(this._config.forms);

        [...forms].forEach(formulario => {

            formulario.addEventListener("submit", event => {

                event.preventDefault();

                switch(formulario.dataset.type) {
                    case 'create': 
                        this.submit(formulario, 'POST');
                        break;

                    case 'update':
                        this.submit(formulario, 'put');
                        break;
                    
                    case 'updatePassword':
                        this.submit(formulario, 'put', 'users/updatePassword');
                        break;
                }
            })

        })

    }

    fireEvents(name, args) {
        if(typeof this._config.listeners[name] == 'function') this._config.listeners[name].apply(this, args);
    }

    delete() {
        let btns = document.querySelectorAll(".btn-delete");

        [...btns].forEach(btn => {
            btn.addEventListener("click", event => {

                if(confirm(`Realmente deseja Excluir ${this._config.type}`))
                    this.submit(btn, 'delete');
            })
        })
    }

    show(){ 
        
        let tr = document.querySelectorAll('tr');

        [...tr].forEach(linha => {

            linha.addEventListener('click', event => {
     
                this.dataUpdate = JSON.parse(linha.dataset.row);
                
                this._config.events.escrever(this.dataUpdate);
            })

        })

    }

    submit(form, method, action = null) {

        let formData = form.dataset.type != 'delete' ? new FormData(form) : new FormData();

        if(['updatePassword', 'update'].indexOf(form.dataset.type) != -1) formData.append("id", this.dataUpdate.id);
        else if(form.dataset.type == 'delete') formData.append("id", form.dataset.id);

        fetch(action != null ? action : this._config.route, {
          method: method.toUpperCase(),
          body: formData
        })
          .then(response => response.json())
          .then(json => {
            window.location.reload();
          }).catch(err => {
            window.location.href = `${window.location.href}?cod=2`;
          })
    }

}