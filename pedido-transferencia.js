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
                box-shadow: 0 6px 20px rgba(0,0,0,0.16);
                padding: 24px 24px 28px;
                border-top: 4px solid #ffc107;
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
                width: 80px;
            }
            .header-title h2 {
                margin: 0;
                font-size: 20px;
                color: #004d40;
            }
            .header-title p {
                margin: 2px 0;
                font-size: 12px;
                color: #555;
            }

            .alerta {
                background: #fff8e1;
                border: 1px solid #ffe082;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 12px;
                color: #6d4c41;
                margin-bottom: 10px;
            }

            .row {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
            }
            .col {
                flex: 1;
                min-width: 220px;
            }

            .section-title {
                margin-top: 16px;
                font-weight: bold;
                font-size: 14px;
                color: #004d40;
                border-left: 4px solid #004d40;
                padding-left: 8px;
            }

            label {
                font-weight: bold;
                margin-top: 10px;
                display: block;
                font-size: 13px;
                color: #333;
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

            .small-note {
                font-size: 12px;
                color: #777;
                margin-top: 4px;
            }

            .rescisao-box {
                background: #f3f7ff;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 12px;
                color: #37474f;
                border: 1px solid #bbdefb;
                margin-top: 8px;
            }

            .token-area {
                background: #f1f8e9;
                border-radius: 10px;
                padding: 12px 14px;
                margin-top: 10px;
                border: 1px dashed #9e9d24;
            }
            .token-area p {
                margin: 0 0 8px;
                font-size: 12px;
                color: #555;
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
            .btn-primary:hover {
                background: #00695c;
            }
            .btn-secondary {
                background: #eceff1;
            }
            .btn-secondary:hover {
                background: #cfd8dc;
            }

            .buttons {
                margin-top: 20px;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                flex-wrap: wrap;
            }

            .msg {
                margin-top: 12px;
                font-size: 13px;
                min-height: 18px;
            }
            .erro { color: #b71c1c; }
            .sucesso { color: #2e7d32; }
            .info { color: #1565c0; }

            @media (max-width: 600px) {
                .header {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .header img.logo {
                    width: 72px;
                }
            }
        </style>

        <div class="card">
            <div class="header">
                <img class="logo" src="https://static.wixstatic.com/media/b0ca3c_4aceed1b7d8f4507b9a9d03d9cb55b06~mv2.png" alt="Colégio Raízes">
                <div class="header-title">
                    <h2>Pedido de Transferência / Cancelamento</h2>
                    <p>Colégio Raízes – Educação Infantil, Ensino Fundamental e Médio</p>
                    <p id="linha-data"></p>
                </div>
            </div>

            <div class="alerta">
                <b>IMPORTANTE:</b> Os dados preenchidos neste formulário serão utilizados para gerar a
                <b>declaração oficial de transferência/rescisão</b>.  
                Informações incorretas ou incompletas podem atrasar a emissão da documentação e a matrícula
                do aluno na nova instituição. Revise com atenção nomes, séries, CPF, telefone e e-mail antes de enviar.
            </div>

            <div class="section-title">Dados do responsável</div>
            <div class="row">
                <div class="col">
                    <label>Nome do responsável</label>
                    <input id="responsavel">
                </div>
                <div class="col">
                    <label>CPF do responsável</label>
                    <input id="cpf" placeholder="000.000.000-00">
                </div>
            </div>

            <div class="section-title">Dados do aluno</div>
            <div class="row">
                <div class="col">
                    <label>Aluno(a)</label>
                    <input id="aluno">
                </div>
                <div class="col">
                    <label>Série / Turma (atual)</label>
                    <input id="serie" placeholder="Ex: 5º ano A">
                </div>
            </div>

            <div class="section-title">Informações da solicitação</div>
            <div class="row">
                <div class="col">
                    <label>Tipo de solicitação</label>
                    <select id="tipo">
                        <option value="">Selecione...</option>
                        <option>Transferência</option>
                        <option>Cancelamento</option>
                    </select>
                </div>
                <div class="col">
                    <label>Momento da solicitação</label>
                    <select id="momento">
                        <option value="">Selecione...</option>
                        <option>Meio do ano</option>
                        <option>Fim do ano</option>
                    </select>
                    <div class="small-note">
                        Meio do ano: prossegue na mesma série. Fim do ano: pode avançar para a próxima série.
                    </div>
                </div>
            </div>

            <div class="rescisao-box">
                <b>Informação sobre rescisão contratual:</b><br>
                A solicitação de transferência ou cancelamento no decorrer do ano letivo caracteriza
                <b>rescisão contratual</b>, conforme Cláusula 17 do contrato educacional.  
                De forma resumida:
                <ul style="margin:6px 0 0 18px;padding:0;">
                    <li>A rescisão deve ser formalizada por escrito, por meio deste requerimento.</li>
                    <li>O responsável permanece obrigado ao pagamento da próxima mensalidade vincenda.</li>
                    <li>Sem o pedido formal, o contrato permanece ativo, com cobrança normal das parcelas.</li>
                    <li>Rescisões motivadas por divergências pedagógicas ou de serviço passam por processo interno,
                        com registros, reuniões e protocolos, podendo haver multa de 10% sobre o valor restante do ano letivo.</li>
                </ul>
            </div>

            <label>Série / Turma para prosseguir os estudos</label>
            <input id="serieDestino" placeholder="Ex: 6º ano A">

            <label>Motivo da solicitação</label>
            <textarea id="motivo" rows="4" placeholder="Descreva o motivo da transferência ou cancelamento..."></textarea>

            <div class="row">
                <div class="col">
                    <label>Telefone</label>
                    <input id="telefone" placeholder="(11) 99999-9999">
                </div>
                <div class="col">
                    <label>E-mail do responsável</label>
                    <input id="email" type="email" placeholder="email@exemplo.com">
                    <div class="small-note">
                        O e-mail será utilizado para envio do token de assinatura digital e da documentação, após aprovação.
                    </div>
                </div>
            </div>

            <div class="section-title">Assinatura digital</div>
            <p class="small-note">
                A assinatura deste pedido é realizada por <b>token enviado ao e-mail do responsável</b>.
                Siga os passos:
                <br>1. Preencha os dados do responsável e do aluno.
                <br>2. Clique em <b>Enviar token por e-mail</b>.
                <br>3. Digite o código recebido no campo abaixo e envie o pedido.
            </p>

            <div class="token-area">
                <p><b>Token de assinatura</b></p>
                <button id="btn-token" type="button" class="btn-secondary">✉️ Enviar token por e-mail</button>
                <label style="margin-top:10px;">Código recebido no e-mail</label>
                <input id="token" maxlength="10" placeholder="Ex: 394821">
            </div>

            <div class="buttons">
                <button id="btn-enviar" type="button" class="btn-primary">✔ Validar e enviar pedido</button>
            </div>

            <div id="msg" class="msg"></div>
        </div>
        `;

        this.init(shadow);
    }

    init(shadow) {
        const API_URL =
            "https://script.google.com/macros/s/AKfycbw-cTsdcnNnudrKmZvDX0P3jVCDhgV0pUTioOwoX8e7r-r6Uyst3V7LEHogpeYCNADHeQ/exec";

        shadow.getElementById("linha-data").textContent =
            "São Paulo - SP, " + new Date().toLocaleDateString("pt-BR");

        const get = id => shadow.getElementById(id).value.trim();

        const msgEl = shadow.getElementById("msg");
        const setMsg = (texto, tipo = "info") => {
            msgEl.textContent = texto;
            msgEl.className = "msg " + tipo;
        };

        const limpaMensagem = (m) => {
            if (!m) return "";
            if (typeof m === "string") return m;
            if (typeof m === "object" && Object.keys(m).length === 0) return "";
            return JSON.stringify(m);
        };

        // ------------ ENVIAR TOKEN ------------
        shadow.getElementById("btn-token").addEventListener("click", async () => {
            const email = get("email");
            const aluno = get("aluno");
            const responsavel = get("responsavel");

            if (!email || !aluno || !responsavel) {
                setMsg("Preencha Nome do responsável, Aluno e E-mail antes de solicitar o token.", "erro");
                return;
            }

            setMsg("Enviando token...", "info");

            try {
                const resp = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "solicitarToken",
                        email,
                        aluno,
                        responsavel
                    })
                });

                const json = await resp.json();

                if (json.sucesso) {
                    setMsg("Token enviado ao e-mail informado. Verifique a caixa de entrada e o spam.", "sucesso");
                } else {
                    setMsg(limpaMensagem(json.mensagem) || "Erro ao enviar token.", "erro");
                }
            } catch (e) {
                console.error(e);
                setMsg("Erro ao enviar token.", "erro");
            }
        });

        // ------------ ENVIAR PEDIDO + DECLARAÇÃO ------------
        shadow.getElementById("btn-enviar").addEventListener("click", async () => {
            const camposObrig = [
                "responsavel", "cpf", "aluno", "serie", "tipo",
                "momento", "motivo", "telefone", "email", "token"
            ];

            for (let c of camposObrig) {
                if (!get(c)) {
                    setMsg("Preencha todos os campos obrigatórios.", "erro");
                    return;
                }
            }

            const dados = {
                responsavel: get("responsavel"),
                cpf: get("cpf"),
                aluno: get("aluno"),
                serie: get("serie"),
                tipo: get("tipo"),
                momento: get("momento"),
                serieDestino: get("serieDestino") || get("serie"),
                motivo: get("motivo"),
                telefone: get("telefone"),
                email: get("email"),
                token: get("token"),
                cidade: "São Paulo - SP",
                dataLonga: new Date().toLocaleDateString("pt-BR"),
                dataISO: new Date().toISOString().slice(0, 10)
            };

            setMsg("Gerando documentos em PDF...", "info");

            // ---- PDF 1: Pedido (com cabeçalho, rodapé e marca d'água) ----
            const pedidoWrapper = document.createElement("div");
            pedidoWrapper.innerHTML = `
            <div style="font-family:Arial; padding:36px 40px; position:relative; min-height:1000px;">
              <!-- Marca d'água -->
              <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.06; z-index:0;">
                <img src="https://static.wixstatic.com/media/b0ca3c_4aceed1b7d8f4507b9a9d03d9cb55b06~mv2.png" style="width:420px;">
              </div>

              <div style="position:relative; z-index:1;">
                <!-- Cabeçalho -->
                <div style="display:flex;align-items:center;border-bottom:1px solid #ccc;padding-bottom:8px;margin-bottom:16px;">
                  <img src="https://static.wixstatic.com/media/b0ca3c_4aceed1b7d8f4507b9a9d03d9cb55b06~mv2.png" style="width:80px;margin-right:12px;">
                  <div>
                    <div style="font-size:18px;font-weight:bold;color:#004d40;">Colégio Raízes</div>
                    <div style="font-size:11px;color:#555;">
                      R. Diogo de Souza, 257 – Cidade Líder – São Paulo - SP – CEP 08285-330<br>
                      www.raizesedu.com.br – Tel/Fax: (11) 2741-9849
                    </div>
                  </div>
                </div>

                <h2 style="text-align:center;margin-top:0;margin-bottom:16px;">Pedido de Transferência / Cancelamento de Matrícula</h2>

                <p style="font-size:12px;color:#555;margin-bottom:18px;">
                  ${dados.cidade}, ${dados.dataLonga}
                </p>

                <h3 style="font-size:14px;color:#004d40;margin-bottom:6px;">Dados do responsável</h3>
                <p style="font-size:13px;">
                  <b>Responsável:</b> ${dados.responsavel}<br>
                  <b>CPF:</b> ${dados.cpf}<br>
                  <b>Telefone:</b> ${dados.telefone}<br>
                  <b>E-mail:</b> ${dados.email}
                </p>

                <h3 style="font-size:14px;color:#004d40;margin-bottom:6px;">Dados do aluno</h3>
                <p style="font-size:13px;">
                  <b>Aluno(a):</b> ${dados.aluno}<br>
                  <b>Série / Turma (atual):</b> ${dados.serie}<br>
                  <b>Série / Turma para prosseguir os estudos:</b> ${dados.serieDestino}
                </p>

                <h3 style="font-size:14px;color:#004d40;margin-bottom:6px;">Solicitação</h3>
                <p style="font-size:13px;">
                  <b>Tipo de solicitação:</b> ${dados.tipo}<br>
                  <b>Momento da solicitação:</b> ${dados.momento}
                </p>

                <h3 style="font-size:14px;color:#004d40;margin-bottom:6px;">Motivo</h3>
                <p style="font-size:13px;white-space:pre-wrap;">
                  ${dados.motivo}
                </p>

                <h3 style="font-size:14px;color:#004d40;margin-bottom:6px;">Assinatura digital</h3>
                <p style="font-size:13px;">
                  O responsável confirmou este pedido por meio de token enviado ao e-mail informado.<br>
                  <b>Código de validação:</b> ${dados.token}
                </p>

                <!-- Rodapé -->
                <div style="border-top:1px solid #ccc;margin-top:40px;padding-top:6px;font-size:11px;color:#555;text-align:center;">
                  Documento gerado eletronicamente pelo sistema do Colégio Raízes. Não requer assinatura manual.
                </div>
              </div>
            </div>`;

            const pedidoPdfUri = await html2pdf()
                .set({
                    margin: 10,
                    filename: `pedido_${dados.aluno}_${dados.dataISO}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "mm", format: "a4" }
                })
                .from(pedidoWrapper)
                .outputPdf("datauristring");

            const pdfBase64 = pedidoPdfUri.split(",")[1];

            // ---- PDF 2: Declaração de Transferência (modelo Raízes) ----
            const declaracaoWrapper = document.createElement("div");
            declaracaoWrapper.innerHTML = `
            <div style="font-family:Arial; padding:40px 52px; position:relative; min-height:1000px;">
              <!-- Marca d'água -->
              <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.06; z-index:0;">
                <img src="https://static.wixstatic.com/media/b0ca3c_4aceed1b7d8f4507b9a9d03d9cb55b06~mv2.png" style="width:420px;">
              </div>

              <div style="position:relative; z-index:1;">
                <!-- Cabeçalho -->
                <div style="display:flex;align-items:center;border-bottom:1px solid #ccc;padding-bottom:8px;margin-bottom:24px;">
                  <img src="https://static.wixstatic.com/media/b0ca3c_4aceed1b7d8f4507b9a9d03d9cb55b06~mv2.png" style="width:80px;margin-right:12px;">
                  <div>
                    <div style="font-size:18px;font-weight:bold;color:#004d40;">Colégio Raízes</div>
                    <div style="font-size:11px;color:#555;">
                      R. Diogo de Souza, 257 – Cidade Líder – São Paulo - SP – CEP 08285-330<br>
                      www.raizesedu.com.br – Tel/Fax: (11) 2741-9849
                    </div>
                  </div>
                </div>

                <h2 style="text-align:center;margin-top:0;margin-bottom:32px;">Declaração de Transferência</h2>

                <p style="font-size:13px;line-height:1.6;">
                  Atesto para os devidos fins, que o aluno(a)
                  <b>${dados.aluno}</b>,
                  está cursando o(a)
                  <b>${dados.serie}</b>,
                  e deve prosseguir os estudos no(a)
                  <b>${dados.serieDestino}</b>.
                </p>

                <p style="font-size:13px;line-height:1.6;">
                  A documentação de Histórico escolar tem o prazo de 90 (noventa) dias, ao contar da data da transferência.
                  (caso haja documentação pendente, conta a partir da entrega da documentação).
                </p>

                <p style="font-size:13px;margin-top:32px;">
                  Sem mais,
                </p>

                <p style="font-size:13px;margin-top:40px;">
                  ${dados.cidade}, ${dados.dataLonga}
                </p>

                <div style="border-top:1px solid #ccc;margin-top:80px;padding-top:6px;font-size:11px;color:#555;text-align:center;">
                  Documento gerado eletronicamente pelo sistema do Colégio Raízes. Não requer assinatura manual.
                </div>
              </div>
            </div>`;

            const declaracaoPdfUri = await html2pdf()
                .set({
                    margin: 10,
                    filename: `declaracao_transferencia_${dados.aluno}_${dados.dataISO}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "mm", format: "a4" }
                })
                .from(declaracaoWrapper)
                .outputPdf("datauristring");

            const declaracaoBase64 = declaracaoPdfUri.split(",")[1];

            // ---- Enviar tudo para o Apps Script ----
            setMsg("Enviando documentos para o Colégio. Aguarde...", "info");

            try {
                const resp = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "salvarPedido",
                        ...dados,
                        pdfBase64,
                        declaracaoBase64
                    })
                });

                const json = await resp.json();

                if (json.sucesso) {
                    setMsg("Pedido enviado com sucesso. Você receberá a documentação após a aprovação da escola.", "sucesso");
                } else {
                    setMsg(limpaMensagem(json.mensagem) || "Erro ao salvar os documentos.", "erro");
                }

            } catch (e) {
                console.error(e);
                setMsg("Erro ao concluir o envio dos documentos.", "erro");
            }
        });
    }
}

customElements.define("pedido-transferencia", PedidoTransferencia);
