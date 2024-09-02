import { useState, useEffect } from 'react';
import a from './img/gifs/dbz.gif';
import b from './img/gifs/dbz2.gif';
import c from './img/gifs/menina.gif';
import d from './img/gifs/naruto.gif';
import e from './img/gifs/poke.gif';
import f from './img/gifs/robo.gif';
import './App.css'

function App() {
  // states
  const [photoInformation, setPhotoInformation] = useState([]);
  const [valorInput, setValorInput] = useState('');
  const [filtro, setFilter] = useState('todos');
  const [noResults, setNoResults] = useState(false);
  const [pageOffset, setPageOffset] = useState(1);
  const [pageLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  // outros eventos
  const lervalorInput = (event) => {  
    setValorInput(event.target.value);
    setPageOffset(0);
  };
  useEffect(() => {
    fetch(`https://kitsu.io/api/edge/anime?filter[text]=${valorInput}&page[limit]=${pageLimit}&page[offset]=${pageOffset}`)
      .then(res => res.json())
      .then(data => {
        setPhotoInformation(data.data);
        setNoResults(data.data.length === 0);
        setTotalPages(Math.ceil(data.meta.count / pageLimit)); // Calcula o total de páginas
      });
  }, [valorInput, pageOffset, pageLimit]);

  // Eventos de filtro
  const todos = () => setFilter('todos', setPageOffset(0));
  const anime = () => setFilter('anime', setPageOffset(0));
  const filme = () => setFilter('filme', setPageOffset(0));
  const filtrar_valores = photoInformation.filter((info) => {
    if (filtro === 'todos') return true;
    else if (filtro === 'anime' && info.attributes.showType === 'TV') return true;
    else if (filtro === 'filme' && info.attributes.showType === 'movie') return true;
    return false;
  });

  // Função para copiar texto
  const copiarTexto = (texto) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto)
        .then(() => {
          alert(`Texto copiado: ${texto}`);
        })
        .catch(err => {
          console.error('Erro ao copiar: ', err);
        });
    } else {
      const inputTemp = document.createElement('input');
      inputTemp.value = texto;
      document.body.appendChild(inputTemp);
      inputTemp.select();
      document.execCommand('copy');
      document.body.removeChild(inputTemp);
      alert(`Texto copiado: ${texto}`);
    }
  };

  // paginação
  const nextPage = () => {
    if (pageOffset + pageLimit < totalPages * pageLimit) {
      setPageOffset(prevOffset => {
        const newOffset = prevOffset + pageLimit;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
        return newOffset;
      });
    }
  };

  const prevPage = () => {
    if (pageOffset > 0) {
      setPageOffset(prevOffset => {
        const newOffset = prevOffset - pageLimit;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo da tela
        }, 0); // Garante que o scroll ocorra após a atualização do estado
        return newOffset;
      });
    }
  };

  return (
    <div className='pai'>
      <h1>NekoSearch</h1>
      <marquee behavior="scroll" direction="" scrollamount="10">
        <img src={a} alt="icon"/>
        <img src={b} alt="icon"/>
        <img src={c} alt="icon"/>
        <img src={d} alt="icon"/>
        <img src={e} alt="icon"/>
        <img src={f} alt="icon"/>
      </marquee>
      <div className="input_value">
        <input type="text" value={valorInput} onChange={lervalorInput} placeholder='Procurar' maxLength={40}/>
      </div>
      <hr />

      <div className="buttons">
        <button onClick={todos} disabled={filtro === 'todos'}>Todos</button>
        <button onClick={anime} disabled={filtro === 'anime'}>Anime</button>
        <button onClick={filme} disabled={filtro === 'filme'}>Filmes</button>
      </div>

      <div className='mapeamento'>
        {filtrar_valores.map((info) => (
          <div key={info.id} className='cards'>
            <img src={info.attributes.posterImage.medium} alt={info.attributes.canonicalTitle} />
            <p onClick={() => copiarTexto(info.attributes.canonicalTitle)}>
              <span>Click para aqui copiar:</span> {info.attributes.canonicalTitle}
            </p>
          </div>
        ))}
      </div>
      
      {noResults && (
        <div>
          <h1>Nenhum anime encontrado</h1>
        </div>
      )}
      <div className="pagination">
        <button onClick={prevPage} disabled={pageOffset === 1}>Anterior</button>
        <span>Página {parseInt(pageOffset / pageLimit + 1)}</span>
        <button onClick={nextPage} disabled={(pageOffset + pageLimit) >= totalPages * pageLimit}>Próximo</button>
      </div>
    </div>
  );
}

export default App;
