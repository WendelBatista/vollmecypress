import { makeObservable, observable, action, toJS } from "mobx";

interface IUsuario {
    email: string,
    token: string
}

class AutenticaStore {
    estaAutenticado = false;
    usuario: IUsuario = {email: "", token: ""};

    constructor() {
        makeObservable(this, {
            estaAutenticado: observable,
            usuario: observable,
            login: action,
            logout: action
        })
    }

    login({email, token} : IUsuario) {
        console.log("Token recebido no login:", token);
        this.usuario = {email, token};
        this.estaAutenticado = true;
        localStorage.setItem("token", token);
        console.log("Estado do autenticaStore após login:", toJS(this.usuario));
    }

    logout() {
        this.estaAutenticado = false;
        this.usuario = {email: "", token: ""}
        localStorage.clear()
    }
}

const autenticaStore = new AutenticaStore();

export default autenticaStore;