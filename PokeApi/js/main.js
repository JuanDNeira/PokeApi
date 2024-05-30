const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";
const pokemonOrdenados = [];

async function fetchPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  const data = await response.json();
  const totalPokemon = data.count;

  for (let i = 1; i <= totalPokemon; i++) {
    await fetch(URL + i)
      .then(response => response.json())
      .then(data => mostrarPokemon(data))
      .catch(error => console.error(error));
  }
}

function mostrarPokemon(poke) {
  let tipos = poke.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
  tipos = tipos.join('');
  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("pokemon");
  poke.types.forEach(type => {
    div.classList.add(type.type.name);
  });

  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
      <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-nombre">${poke.name}</h2>
      </div>
      <div class="pokemon-tipos">
        ${tipos}
      </div>
    </div>
  `;

  div.addEventListener('click', () => {
    mostrarDetallesPokemon(poke);
  });

  pokemonOrdenados.push(div);
}

function mostrarDetallesPokemon(poke) {
  const detallesPokemonDiv = document.getElementById('detalles-pokemon');
  const detallesPokemonInfo = detallesPokemonDiv.querySelector('.detalles-pokemon-info');
  const btnCerrar = detallesPokemonDiv.querySelector('.btn-cerrar');

  detallesPokemonInfo.innerHTML = '';

  const imagen = document.createElement('img');
  imagen.src = poke.sprites.other['official-artwork'].front_default;
  imagen.alt = poke.name;
  detallesPokemonInfo.appendChild(imagen);

  const tabla = document.createElement('table');
  tabla.classList.add('pokemon-info-table');

  agregarFilaTabla(tabla, "Nombre : ", poke.name);
  agregarFilaTabla(tabla, "ID : ", `#${poke.id}`);
  poke.types.forEach((type, index) => {
    agregarFilaTabla(tabla, index === 0 ? "Tipo : " : "", type.type.name);
  });
  agregarFilaTabla(tabla, "Altura : ", `${poke.height}m`);
  agregarFilaTabla(tabla, "Peso : ", `${poke.weight}kg`);
  const habilidades = poke.abilities.map(ability => ability.ability.name).join(', ');
  agregarFilaTabla(tabla, "Habilidades : ", habilidades);

  const btnMovimientos = document.createElement('button');
  btnMovimientos.textContent = 'Movimientos';

  btnMovimientos.addEventListener('mouseover', () => {
    btnMovimientos.style.cursor = 'pointer'; 
  });
  btnMovimientos.addEventListener('mouseout', () => {
    btnMovimientos.style.cursor = 'default'; 
  });

  btnMovimientos.addEventListener('click', () => {
    mostrarMovimientosPokemon(poke);
  });

  detallesPokemonInfo.appendChild(btnMovimientos);
  detallesPokemonInfo.appendChild(tabla);

  detallesPokemonDiv.classList.remove('oculto');
}

async function mostrarMovimientosPokemon(poke) {
  const detallesPokemonDiv = document.getElementById('detalles-pokemon');
  const detallesPokemonInfo = detallesPokemonDiv.querySelector('.detalles-pokemon-info');
  detallesPokemonInfo.innerHTML = '';

  const tablaMovimientos = document.createElement('table');
  tablaMovimientos.classList.add('movimientos-pokemon-table');

  const cabecera = tablaMovimientos.createTHead();
  const filaCabecera = cabecera.insertRow();
  const headers = [ 'Move', 'Type', 'Category', 'Power', 'PP', 'Accuracy'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    filaCabecera.appendChild(th);
  });

  const cuerpoTabla = document.createElement('tbody');
  for (const moveData of poke.moves) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveData.move.name}`);
    const moveDetails = await response.json();

    const fila = cuerpoTabla.insertRow();
    fila.insertCell().textContent = moveDetails.name;
    fila.insertCell().textContent = moveDetails.type.name;
    fila.insertCell().textContent = moveDetails.damage_class.name;
    fila.insertCell().textContent = moveDetails.power || '-';
    fila.insertCell().textContent = moveDetails.pp || '-';
    fila.insertCell().textContent = moveDetails.accuracy || '-';
  }

  tablaMovimientos.appendChild(cuerpoTabla);
  detallesPokemonInfo.appendChild(tablaMovimientos);
}

function agregarFilaTabla(tabla, etiqueta, valor) {
  const fila = tabla.insertRow();
  const celdaEtiqueta = fila.insertCell();
  const celdaValor = fila.insertCell();
  celdaEtiqueta.textContent = etiqueta;
  celdaValor.textContent = valor;
}

function mostrarPokemonOrdenados() {
  pokemonOrdenados.sort((a, b) => {
    const idA = parseInt(a.querySelector(".pokemon-id").textContent.replace("#", ""));
    const idB = parseInt(b.querySelector(".pokemon-id").textContent.replace("#", ""));
    return idA - idB;
  });

  listaPokemon.innerHTML = "";
  pokemonOrdenados.forEach(pokemon => {
    listaPokemon.appendChild(pokemon);
  });
}

fetchPokemon();
setTimeout(mostrarPokemonOrdenados, 7000);

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
  const botonId = event.currentTarget.id;
  listaPokemon.innerHTML = "";

  if (botonId === "ver-todos") {
    setTimeout(mostrarPokemonOrdenados, );
  } else {
    setTimeout(() => {
      pokemonOrdenados.forEach(pokemon => {
        const tipos = pokemon.querySelectorAll(".pokemon-tipos .tipo");
        const tiposTexto = Array.from(tipos).map(tipo => tipo.textContent.toLowerCase());
        if (tiposTexto.includes(botonId)) {
          listaPokemon.appendChild(pokemon);
        }
      });
    }, );
  }
}));

document.addEventListener('DOMContentLoaded', function () {
  const detallesPokemon = document.getElementById('detalles-pokemon');

  function ocultarDetallesPokemon() {
      detallesPokemon.classList.add('oculto');
  }
  const closeButton = document.createElement('span');
  closeButton.classList.add('close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', ocultarDetallesPokemon);
  document.querySelector('.detalles-pokemon-contenido').appendChild(closeButton);
});

function buscarPokemon() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filteredPokemon = pokemonOrdenados.filter(pokemon => {
    const nombre = pokemon.querySelector('.pokemon-nombre').textContent.toLowerCase();
    const numero = pokemon.querySelector('.pokemon-id').textContent.replace('#', '');
    return nombre.includes(searchInput) || numero.includes(searchInput);
  });

  listaPokemon.innerHTML = '';
  filteredPokemon.forEach(pokemon => listaPokemon.appendChild(pokemon));
}

function ordenarPokemon(orden) {
  pokemonOrdenados.sort((a, b) => {
    const nombreA = a.querySelector('.pokemon-nombre').textContent.toLowerCase();
    const nombreB = b.querySelector('.pokemon-nombre').textContent.toLowerCase();
    const idA = parseInt(a.querySelector('.pokemon-id').textContent.replace('#', ''));
    const idB = parseInt(b.querySelector('.pokemon-id').textContent.replace('#', ''));

    if (orden === 'asc') {
      if (nombreA < nombreB) return -1;
      if (nombreA > nombreB) return 1;
      return idA - idB;
    } else {
      if (nombreA > nombreB) return -1;
      if (nombreA < nombreB) return 1;
      return idB - idA;
    }
  });

  listaPokemon.innerHTML = '';
  pokemonOrdenados.forEach(pokemon => listaPokemon.appendChild(pokemon));
}

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortAscButton = document.getElementById('sortAscButton');
const sortDescButton = document.getElementById('sortDescButton');

searchInput.addEventListener('input', buscarPokemon);
searchButton.addEventListener('click', buscarPokemon);
sortAscButton.addEventListener('click', () => ordenarPokemon('asc'));
sortDescButton.addEventListener('click', () => ordenarPokemon('desc'));