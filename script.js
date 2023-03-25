const ROWS = 38;
const COLS = 100;

let playing = false;

const grid = new Array( ROWS );
const nextGrid = new Array( ROWS );

let timer;
const reproductionTime = 100;

const initializeGrids = () => {
  for ( let i = 0; i < ROWS; i++ ) {
    grid[ i ] = new Array( COLS );
    nextGrid[ i ] = new Array( COLS );
  }
}

const resetGrids = () => {
  for ( let i = 0; i < ROWS; i++ ) {
    for ( let j = 0; j < COLS; j++ ) {
      grid[ i ][ j ] = 0;
      nextGrid[ i ][ j ] = 0;
    }
  }
}

const copyAndResetGrid = () => {
  for ( let i = 0; i < ROWS; i++ ) {
    for ( let j = 0; j < COLS; j++ ) {
      grid[ i ][ j ] = nextGrid[ i ][ j ];
      nextGrid[ i ][ j ] = 0;
    }
  }
}

const initialize = () => {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

const createTable = () => {
  const gridContainer = document.getElementById( 'gridContainer' );
  if ( !gridContainer )
    console.error( 'Problem: No div for the drid table!' );

  const table = document.createElement( 'table' );
  
  for ( let i = 0; i < ROWS; i++ ) {
    const tr = document.createElement( 'tr' );
    for ( let j = 0; j < COLS; j++ ) {//
      const cell = document.createElement( 'td' );
      cell.setAttribute( 'id', i + '_' + j );
      cell.setAttribute( 'class', 'dead' );
      cell.onclick = cellClickHandler;
      tr.appendChild( cell );
    }
    table.appendChild( tr );
  }
  gridContainer.appendChild( table );
}

function cellClickHandler() {
  const rowcol = this.id.split( '_' );
  const row = rowcol[ 0 ];
  const col = rowcol[ 1 ];

  const classes = this.getAttribute('class');
  if ( classes.indexOf( 'live' ) > -1 ) {
    this.setAttribute( 'class', 'dead' );
    grid[ row ][ col ] = 0;
  } else {
    this.setAttribute( 'class', 'live' );
    grid[ row ][ col ] = 1;
  }
}

function updateView() {
  for ( let i = 0; i < ROWS; i++ ) {
    for ( let j = 0; j < COLS; j++ ) {
      const cell = document.getElementById(i + '_' + j);
      if ( grid[ i ][ j ] == 0 ) {
        cell.setAttribute( 'class', 'dead' );
      } else {
        cell.setAttribute( 'class', 'live' );
      }
    }
  }
}

const setupControlButtons = () => {
  const startButton = document.getElementById('start');
  startButton.onclick = startButtonHandler;
  const clearButton = document.getElementById('clear');
  clearButton.onclick = clearButtonHandler;
  const randomButton = document.getElementById('random');
  randomButton.onclick = randomButtonHandler;
}

const randomButtonHandler = () => {
  if ( playing ) return;
  clearButtonHandler();
  for ( let i = 0; i < ROWS; i++ ) {
    for ( let j = 0; j < COLS; j++ ) {
      const isLive = Math.round( Math.random() );
      if ( isLive == 1 ) {
        var cell = document.getElementById( i + '_' + j );
        cell.setAttribute( 'class', 'live' );
        grid[ i ][ j ] = 1;
      }
    }
  }
}

const clearButtonHandler = () => {
  playing = false;
  const startButton = document.getElementById( 'start' );
  startButton.innerHTML = 'Start';    
  clearTimeout( timer );
  
  const cellsList = document.getElementsByClassName( 'live' );

  const cells = [];
  for ( let i = 0; i < cellsList.length; i++ )
    cells.push( cellsList[ i ] );
  
  for ( let i = 0; i < cells.length; i++ )
    cells[ i ].setAttribute( 'class', 'dead' );
  resetGrids;
}

function startButtonHandler () {
  if ( playing ) {
    playing = false;
    this.innerHTML = 'Continue';
    clearTimeout( timer );
  } else {
    playing = true;
    this.innerHTML = 'Pause';
    play();
  }
}

const play = () => {
  computeNextGen();
  if ( playing )
    timer = setTimeout( play, reproductionTime );
}

const computeNextGen = () => {
  for ( let i = 0; i < ROWS; i++ ) {
    for ( let j = 0; j < COLS; j++ )
      applyRules( i, j );
  }
  copyAndResetGrid();
  updateView();
}

const applyRules = ( row, col ) => {
  const numNeighbors = countNeighbors( row, col );
  if ( grid[ row ][ col ] == 1 ) {
    if ( numNeighbors < 2 )
      nextGrid[ row ][ col ] = 0;
    else if ( numNeighbors == 2 || numNeighbors == 3 )
      nextGrid[ row ][ col ] = 1;
    else if ( numNeighbors > 3 )
      nextGrid[ row ][ col ] = 0;
  } else if ( grid[ row ][ col ] == 0 ) {
    if ( numNeighbors == 3 )
      nextGrid[ row ][ col ] = 1;
  }
}
    
const countNeighbors = ( row, col ) => {
    let count = 0;
    if ( row - 1 >= 0 )
        if ( grid[ row - 1 ][ col ] == 1 ) count++;

    if ( row - 1 >= 0 && col - 1 >= 0 )
        if ( grid[ row - 1 ][ col - 1 ] == 1 ) count++;

    if ( row - 1 >= 0 && col + 1 < COLS )
        if ( grid[ row - 1 ][ col + 1 ] == 1 ) count++;

    if ( col - 1 >= 0 )
        if ( grid[ row ][ col - 1 ] == 1 ) count++;

    if ( col + 1 < COLS )
        if ( grid[ row ][ col + 1 ] == 1 ) count++;

    if ( row + 1 < ROWS )
        if ( grid[ row + 1 ][ col ] == 1 ) count++;

    if ( row + 1 < ROWS && col - 1 >= 0 )
        if ( grid[ row + 1 ][ col - 1 ] == 1 ) count++;

    if ( row + 1 < ROWS && col + 1 < COLS )
        if ( grid[ row + 1 ][ col + 1 ] == 1 ) count++;

    return count;
}

window.onload = initialize;
