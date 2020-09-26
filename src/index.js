import React from 'react'
import ReactDOM from 'react-dom'

import Logo from './images/logo.png'
import './styles/styles.css'

function CharacterCard(props){ //CharacaterCard representa cada una de las tarjetas de los personajes
    const { character } = props; //creamos un obj character, que es equivalente a los props que recibe el componente

    return (
        <div 
            className="CharacterCard"
            style={{ backgroundImage: `url(${character.image})` }}
        >
            <div className="CharacterCard__name-container text-truncate">
                {character.name}
            </div>
        </div>
    )
}

class App extends React.Component{
    state = { //Inicializamos el estado así como sus 3 fases
        loading: true,
        error: null,
        data: {
            info: {},
            results: []
        },
        nextPage: 1,
    }
    componentDidMount(){ //cuando el componente haga el montaje, se lanzará la función fetchCharacters
        this.fetchCharacters()
    }

    fetchCharacters = async () => { 
        this.setState({loading:true, error:null}) //Al inicializar la función fetchCharacters, establecemos cambios en el estado previos a las peticiones 

        try{
            const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${this.state.nextPage}`) //la api por cada página proveé 20 resultados 
            const data = await response.json()
            // console.log(data)
            this.setState({ //si la peticion fue exitosa, se establecerá el estado de la manera que indica
                loading: false,
                error: false,
                data: {
                    info: data.info,
                    results: [].concat(this.state.data.results, data.results) //para que no se borren los resultados previos, concatenamos lo que tenia el array con los neuvos resultados
                },
                nextPage : this.state.nextPage + 1, //queremos conocer los resultados de las siguientes páginas por lo tanto incrementamos cada vez 1 página más
            })
        }catch(error){ //si sucede un error se establecerá el estado de esta manera
            this.setState({loading:false, error: true})
        }
    }

    //Posterior al montaje del componente, se renderizan los resultados
    render(){ //si hubo un error en state, debe retornar Error!
        if(this.state.error){
            return "Error!"
        }

        return(
            <div className="container">
                <div className="App">
                    <img className="Logo" src={Logo} alt=""/>

                    <ul className="row">
                        {this.state.data.results.map( character => (
                            <li className="col-6 col-md-3" key={character.id}>
                                <CharacterCard character={character}/>
                            </li>
                        ))}
                    </ul>

                    {this.state.loading && <p className="text-center">Loading...</p>} 

                    {!this.state.loading && this.state.data.info.next && (
                        <button onClick={() => this.fetchCharacters()}>Load more</button>
                    )}
                </div>
            </div>
        )
    }
}

//El operador && en React representa un renderizado condicional, hace alusión a un if(true){ }, debido a que si lo que indicamos es verdadero, sucederá lo que indica el operador de renderizado condicional

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)