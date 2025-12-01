class PedidoTransferencia extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
        <style>
            * { box-sizing: border-box; }
            .card {
                background: #ffffff;
                border-radius: 14px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.12);
                padding: 24px;
                border-top: 4px solid #004d40;
                font-family: Arial, sans-serif;
            }
            .header {
                display: flex;
                align-items: center;
                gap: 16px;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 12px;
                margin-bottom: 16px;
            }
            .header img.logo {
                width: 90px;
            }
            .header-title h2 {
                margin: 0;
                font-size: 20px;
                color: #004d40;
            }
            label {
                font-weight: bold;
                margin-top: 10px;
                display: block;
            }
            input, textarea, select {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #b0bec5;
                font-size: 14px;
            }
            input:focus, textarea:focus, select:focus {
                outline: none;
                border-color: #004d40;
                box-shadow: 0 0 0 2px rgba(0, 77, 64, 0.15);
            }
            textarea { resize: vertical; }

            .token-area {
                background: #f1f8e9;
                border-radius: 10px;
                padding: 12px;
                margin-top: 10px;
                border: 1px dashed #9e9d24;
            }

            button {
                padding: 11px 18px;
                border-radius: 999px;
                border: none;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
            }
            .btn-primary {
                background: #004d40;
                color: white;
            }
            .btn-secondary {
                background: #eceff1;
            }

            .msg {
                margin-top: 12px;
                font-size: 13px;
                min-height: 18px;
            }
            .erro { color: #b71c1c; }
            .sucesso { color: #2e7d32; }
            .info { color: #1565c0; }
        </style>

        <div class="card">
            <div class="header">
                <img class="logo" src="https://static.wixstatic.com/media/b0ca3c_4aceed1b7d8f4507b9a9d03d9cb55b06~mv2.png">
                <div class="header-title">
                    <h2>Pedido de Transferência / Cancelamento</h2>
                    <p id="linha-data"></p>
                </div>
            </div>

            <label>Nome do responsável:</label>
            <input id="responsavel">

            <label>CPF:</label>
            <input id="cpf">

            <label>Aluno(a):</label>
            <input id="aluno">

            <label>Série / Turma:</label>
            <input id="serie">

            <label>Tipo de solicitação:</label>
            <select id="tipo">
                <option value="">Selecione...</option>
                <option>Transferência</option>
                <option>Cancelamento</option>
            </select>

            <label>Motivo:</label>
            <textarea id="motivo" rows="4"></textarea>

            <label>Telefone:</label>
            <input id="telefone">

            <label>E-mail:</label>
            <input id="email">

            <div class="token-area">
                <button id="btn-token" class="btn-secondary">Enviar token por e-mail</button>
                <label style="margin-top:10px;">Código recebido:</label>
                <input id="token" maxlength="10">
            </div>

            <button id="btn-enviar" class="btn-primary" style="margin-top:20px;">✔ Validar e enviar pedido</button>
            <div id="msg" class="msg"></div>
        </div>
        `;

        this.init(shadow);
    }

    init(shadow) {
        const API_URL =
        "https://script.google.com/macros/s/AKfycbws4iTQbSSL752yMX8S56AKWXrZS-7GmppyHxniwbr2d_9gmfnuoBpDy1Nir2aJRNWWtA/exec";

        const limpaObj = m => {
            if (!m) return "";
            if (typeof m === "string") return m;
            if (typeof m === "object" && Object.keys(m).length === 0) return "";
            return JSON.stringify(m);
        };

        shadow.getElementById("linha-data").textContent =
            "São Paulo - SP, " + new Date().toLocaleDateString("pt-BR");

        const get = id => shadow.getElementById(id).value.trim();

        const msg = shadow.getElementById("msg");
        const setMsg = (texto, tipo = "info") => {
            msg.textContent = texto;
            msg.className = tipo;
        };

        // --------------------------------------------------------
        // ENVIAR TOKEN
        // --------------------------------------------------------
        shadow.getElementById("btn-token").addEventListener("click", async () => {
            const email = get("email");
            const aluno = get("aluno");
            const responsavel = get("responsavel");

            if (!email || !aluno || !responsavel) {
                setMsg("Preencha Nome, Aluno e E-mail antes de solicitar.", "erro");
                return;
            }

            setMsg("Enviando token...", "info");

            try {
                const resp = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({
                        action: "solicitarToken",
                        email, aluno, responsavel
                    })
                });

                const json = await resp.json();

                if (json.sucesso) {
                    setMsg("Token enviado ao e-mail informado.", "sucesso");
                } else {
                    setMsg(limpaObj(json.mensagem) || "Erro ao enviar token.", "erro");
                }

            } catch {
                setMsg("Erro ao enviar token.", "erro");
            }
        });

        // --------------------------------------------------------
        // ENVIAR FORMULÁRIO
        // --------------------------------------------------------
        shadow.getElementById("btn-enviar").addEventListener("click", async () => {
            const campos = ["responsavel", "cpf", "aluno", "serie", "tipo", "motivo", "telefone", "email", "token"];
            for (let c of campos) {
                if (!get(c)) {
                    setMsg("Preencha todos os campos.", "erro");
                    return;
                }
            }

            setMsg("Gerando PDF...", "info");

            const dados = {
                responsavel: get("responsavel"),
                cpf: get("cpf"),
                aluno: get("aluno"),
                serie: get("serie"),
                tipo: get("tipo"),
                motivo: get("motivo"),
                telefone: get("telefone"),
                email: get("email"),
                token: get("token"),
                cidade: "São Paulo - SP",
                dataLonga: new Date().toLocaleDateString("pt-BR"),
                dataISO: new Date().toISOString().slice(0, 10)
            };

            // GERA PDF
            const container = document.createElement("div");
            container.innerHTML = `
            <div style="font-family:Arial;padding:24px;">
                <h2>Pedido de Transferência / Cancelamento</h2>
                <p><b>Responsável:</b> ${dados.responsavel}</p>
                <p><b>CPF:</b> ${dados.cpf}</p>
                <p><b>Aluno:</b> ${dados.aluno}</p>
                <p><b>Série:</b> ${dados.serie}</p>
                <p><b>Tipo:</b> ${dados.tipo}</p>
                <p><b>Motivo:</b><br>${dados.motivo}</p>
                <p><b>Telefone:</b> ${dados.telefone}</p>
                <p><b>E-mail:</b> ${dados.email}</p>
                <p><b>Token:</b> ${dados.token}</p>
                <p>${dados.cidade}, ${dados.dataLonga}</p>
            </div>`;

            const uri = await html2pdf()
                .set({
                    margin: 10,
                    filename: `pedido_${dados.aluno}_${dados.dataISO}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "mm", format: "a4" }
                })
                .from(container)
                .outputPdf("datauristring");

            dados.pdfBase64 = uri.split(",")[1];

            // ENVIA AO APPS SCRIPT
            try {
                const resp = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({
                        action: "salvarPedido",
                        ...dados
                    })
                });

                const json = await resp.json();

                if (json.sucesso) {
                    setMsg("Pedido enviado com sucesso!", "sucesso");
                } else {
                    setMsg(limpaObj(json.mensagem) || "Erro ao salvar.", "erro");
                }

            } catch {
                setMsg("Erro ao concluir envio.", "erro");
            }
        });
    }
}

customElements.define("pedido-transferencia", PedidoTransferencia);
