 const times = []; // Array que armazena os times cadastrados
    let indiceEdicao = -1; // Variável que guarda o índice do time em edição

    function atualizarLista() { // Função que atualiza os elementos da lista e seletores
      const elementoLista = document.getElementById('listaTimes'); // Pega o elemento da lista
      const seletor1 = document.getElementById('selecaoTime1'); // Pega o primeiro seletor
      const seletor2 = document.getElementById('selecaoTime2'); // Pega o segundo seletor
      elementoLista.innerHTML = ''; // Limpa a lista
      seletor1.innerHTML = ''; // Limpa o seletor 1
      seletor2.innerHTML = ''; // Limpa o seletor 2

      times.forEach((time, i) => { // Para cada time cadastrado
        const item = document.createElement('li'); // Cria um novo item de lista
        item.innerHTML = `<span>${time.nome} (Força: ${time.forca})</span>
                          <div class="grupo-botoes">
                            <button onclick="editarTime(${i})">Editar</button>
                            <button onclick="removerTime(${i})">Remover</button>
                          </div>`; // Insere os dados e botões no item
        elementoLista.appendChild(item); // Adiciona o item na lista

        const opcao1 = document.createElement('option'); // Cria opção para seletor 1
        const opcao2 = document.createElement('option'); // Cria opção para seletor 2
        opcao1.value = opcao2.value = i; // Define valor do índice
        opcao1.textContent = opcao2.textContent = time.nome; // Define texto visível
        seletor1.appendChild(opcao1); // Adiciona no seletor 1
        seletor2.appendChild(opcao2); // Adiciona no seletor 2
      });
    }

    document.getElementById('botaoAdicionar').addEventListener('click', () => { // Quando clicar no botão de adicionar
      const nome = document.getElementById('campoNome').value.trim(); // Pega e limpa o nome do time
      const forca = parseInt(document.getElementById('campoForca').value); // Converte a força em número inteiro

      if (!nome || isNaN(forca) || forca < 0 || forca > 100) { // Valida os dados
        alert('Preencha corretamente o nome e força do time (0-100)');
        return;
      }

      if (indiceEdicao >= 0) { // Se estiver editando
        times[indiceEdicao] = { nome, forca }; // Atualiza os dados do time
        document.getElementById('botaoAdicionar').textContent = 'Adicionar Time'; // Altera texto do botão
        indiceEdicao = -1; // Reseta o modo de edição
      } else {
        if (times.length >= 32) { // Limita a 32 times
          alert('Limite de 32 times atingido.');
          return;
        }
        times.push({ nome, forca }); // Adiciona novo time
      }

      document.getElementById('campoNome').value = ''; // Limpa campo de nome
      document.getElementById('campoForca').value = ''; // Limpa campo de força
      atualizarLista(); // Atualiza a lista
    });

    function editarTime(indice) { // Função que prepara os campos para edição
      const time = times[indice]; // Pega o time pelo índice
      document.getElementById('campoNome').value = time.nome; // Preenche o campo nome
      document.getElementById('campoForca').value = time.forca; // Preenche o campo força
      document.getElementById('botaoAdicionar').textContent = 'Salvar Alterações'; // Altera texto do botão
      indiceEdicao = indice; // Salva o índice em edição
    }

    function removerTime(indice) { // Função que remove um time da lista
      if (confirm('Deseja remover este time?')) { // Confirmação do usuário
        times.splice(indice, 1); // Remove o time do array
        atualizarLista(); // Atualiza a lista
      }
    }

    document.getElementById('botaoSimular').addEventListener('click', () => { // Quando clicar para simular
      const indice1 = document.getElementById('selecaoTime1').value; // Pega índice do time 1
      const indice2 = document.getElementById('selecaoTime2').value; // Pega índice do time 2

      if (indice1 === indice2) { // Verifica se é o mesmo time
        alert('Escolha dois times diferentes!');
        return;
      }

      const time1 = times[indice1]; // Recupera o primeiro time
      const time2 = times[indice2]; // Recupera o segundo time

      const [gols1, gols2] = simularPlacar(time1.forca, time2.forca); // Simula o placar
        simularPartida(time1, time2, gols1, gols2); // Simula a partida no canvas
    });

    function simularPlacar(forca1, forca2) { // Função que calcula placar aleatório baseado nas forças
      const total = forca1 + forca2; // Soma total das forças
      const proporcao1 = forca1 / total; // Proporção do time 1
      const proporcao2 = forca2 / total; // Proporção do time 2
      return [
        Math.floor(Math.random() * 5 * proporcao1), // Calcula gols aleatórios para time 1
        Math.floor(Math.random() * 5 * proporcao2), // Calcula gols aleatórios para time 2
      ];
    }

    const canvas = document.getElementById('campo'); // Pega o elemento canvas
    const ctx = canvas.getContext('2d'); // Pega o contexto 2D do canvas

    function desenharCampo(jogadores, bola) { // Função que desenha o campo de futebol
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
      ctx.fillStyle = "green" ; // Cor do campo
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Desenha o retângulo do campo

      ctx.strokeStyle = '#FFFFFF'; // Cor das linhas
      ctx.lineWidth = 2; // Largura das linhas

      // Desenha as linhas do campo
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Contorno do campo
      ctx.beginPath(); // Linha central
      ctx.moveTo(canvas.width / 2, 10); // Início da linha central
      ctx.lineTo(canvas.width / 2, canvas.height - 10); // Fim da linha central
      ctx.stroke(); // Desenha a linha central

      // Jogadores
      jogadores.forEach(j => { // Para cada jogador
        ctx.beginPath(); // Desenha o jogador
        ctx.arc(j.x, j.y, 15, 0, Math.PI * 2); // Círculo do jogador
        ctx.fillStyle = j.cor; // Cor do time
        ctx.fill(); // Desenha o jogador
        ctx.strokeStyle = "wihite"; // Cor do contorno
        ctx.stroke(); // Contorno do jogador
      });

      // Bola
        ctx.beginPath(); // Desenha a bola
        ctx.arc(bola.x, bola.y, 8, 0, Math.PI * 2); // Círculo da bola
        ctx.fillStyle = 'white'; // Cor da bola
        ctx.fill(); // Desenha a bola
        ctx.stroke(); // Contorno da bola
    }

    function simularPartida(time1, time2, gols1, gols2) {
        const jogadores = [
          { x: 100, y: 100, cor: 'blue', time: 1, velocidade: 2 + time1.forca / 50 },
          { x: 100, y: 250, cor: 'blue', time: 1, velocidade: 2 + time1.forca / 50 },
          { x: 500, y: 150, cor: 'red', time: 2, velocidade: 2 + time2.forca / 50 },
          { x: 500, y: 250, cor: 'red', time: 2, velocidade: 2 + time2.forca / 50 }
        ];
      
        const bola = { x: canvas.width / 2, y: canvas.height / 2 };
        let golsFeitos1 = 0;
        let golsFeitos2 = 0;
        let vencedor = null;
        let destino = null;
      
        function disputa() {
          vencedor = null;
          bola.x = canvas.width / 2;
          bola.y = canvas.height / 2;
      
          // Jogadores "correm" pro centro
          jogadores.forEach(j => {
            j.targetX = bola.x;
            j.targetY = bola.y;
          });
        }
      
        function atualizar() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      
          // Mover jogadores
          jogadores.forEach(j => {
            const dx = (j.targetX || bola.x) - j.x;
            const dy = (j.targetY || bola.y) - j.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
              j.x += (dx / dist) * j.velocidade;
              j.y += (dy / dist) * j.velocidade;
            }
      
            // Chegou primeiro na bola
            if (dist < 15 && vencedor === null) {
              vencedor = j.time;
              destino = vencedor === 1
                ? { x: canvas.width - 30, y: canvas.height / 2 }
                : { x: 30, y: canvas.height / 2 };
            }
          });
      
          // Se já tem vencedor → bola vai pro gol
          if (vencedor !== null && destino) {
            bola.x += (destino.x - bola.x) * 0.08;
            bola.y += (destino.y - bola.y) * 0.08;
      
            // Gol!
            if (Math.abs(bola.x - destino.x) < 10) {
              if (vencedor === 1 && golsFeitos1 < gols1) golsFeitos1++;
              if (vencedor === 2 && golsFeitos2 < gols2) golsFeitos2++;
      
              document.getElementById("placarResultado").textContent =
                `${time1.nome} ${golsFeitos1} x ${golsFeitos2} ${time2.nome}`;
      
              if (golsFeitos1 < gols1 || golsFeitos2 < gols2) {
                setTimeout(disputa, 1000);
              } else {
                clearInterval(loop);
              }
            }
          }
      
          // Desenha campo
          desenharCampo(jogadores, bola);
        }
      
        disputa(); // primeira jogada
        const loop = setInterval(atualizar, 50);
      }      

    atualizarLista(); // Atualiza a lista ao carregar a página