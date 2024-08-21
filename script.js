fetch('http://localhost:3000/lista_albuns')
  .then(res => res.json())
  .then(dados => {
    let str = ''
    for (let i = 0; i < dados.length; i++) {
      let lista_album = dados[i]
      str += `<div class="card mb-5" id="card-lista-album" style="width: 20rem;">
              <img src="${lista_album.imagemCapa}" class="card-img-top" style="width: 100%; height: 250px">
              <div class="card-body">
                <h5 class="card-title">${lista_album.titulo}</h5>
                <p class="card-text">${lista_album.descricao}</p>
                <a href="detalhes.html?id=${lista_album.id}" class="btn" target="_blank">Ver mais</a>
              </div>
              </div>
              `
      document.getElementById('card-lista').innerHTML = str
    }
  })

  function criarAlbum(idURL) {
    const albumId = Number(idURL);

    fetch('http://localhost:3000/albuns')
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar álbuns');
            return res.json();
        })
        .then(albuns => {
            const album = albuns.find(a => Number(a.id) === albumId);

            if (!album) {
                document.getElementById('album').innerHTML = '<p>Álbum não encontrado.</p>';
                return;
            }

            let albumHtml = `
                <div class="album">
                    <h4>Álbum - ${album.titulo}</h4>
                    <hr size="10" width="100%">
                    <div class="card">
                        <div class="row">
                            <div class="col-xl-4">
                                <img src="${album.imagemCapa}" class="img-fluid" style="width: 100%; height: 100%; object-fit: cover; border-top-left-radius: 5px; border-bottom-left-radius: 5px;">
                            </div>
                            <div class="col-xl-8">
                                <div class="descricao">
                                    <h5 style="color: #A0522D;">Descrição</h5>
                                    <h6 style="color: #FFF;">${album.descricao}</h6>
                                    <h5 style="color: #A0522D; margin-top: 2%;">Localização</h5>
                                    <h6 style="color: #FFF; margin-bottom: 2%;">${album.longLat}</h6>
                                    <h5 style="color: #A0522D;">Data de Registro</h5>
                                    <h6 style="color: #FFF;">${album.data}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('album').innerHTML = albumHtml;

            return fetch('http://localhost:3000/fotos');
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar fotos');
            return res.json();
        })
        .then(fotos => {
            const fotosAlbum = fotos.filter(foto => Number(foto.id_album) === albumId);

            let fotosHtml = '';
            if (fotosAlbum.length > 0) {
                fotosHtml = '<div class="title-fotos"><h4>Fotos do Álbum</h4><hr size="10" width="100%"></div><div class="lista_fotos">';
                fotosAlbum.forEach(foto => {
                    fotosHtml += `
                        <div class="col-xl-3 col-md-4" id="item_img">
                            <div class="foto-card" onclick="abrirModal('${foto.imagem_um}', '${foto.imagem_dois}', '${foto.descricao_modal}')">
                                <img src="${foto.imagem_um}" id="img-fluid" class="img-fluid">
                                <p>${foto.descricao}</p>
                            </div>
                        </div>
                    `;
                });
                fotosHtml += '</div>';

                fotosHtml += `
                <div class="modal fade" id="fotoModal" tabindex="-1" aria-labelledby="fotoModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="fotoModalLabel">Detalhes da Foto</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <img id="modalImagemUm" src="" class="img-fluid" alt="Imagem Principal">
                                <img id="modalImagemDois" src="" class="img-fluid mt-3" alt="Imagem Secundária">
                                <p id="modalDescricao"></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            } else {
                fotosHtml = '<p>Nenhuma foto encontrada para este álbum.</p>';
            }

            document.getElementById('album').innerHTML += fotosHtml;
        })
        .catch(error => console.error('Erro:', error));
}

function abrirModal(imagemUm, imagemDois, descricao) {
    document.getElementById('modalImagemUm').src = imagemUm;
    document.getElementById('modalImagemDois').src = imagemDois;
    document.getElementById('modalDescricao').innerText = descricao;

    const myModal = new bootstrap.Modal(document.getElementById('fotoModal'));
    myModal.show();
}