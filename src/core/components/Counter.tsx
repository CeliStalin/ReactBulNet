import { useState } from "react"

interface CounterApp{
    value:number
}

const Counter =({value}:CounterApp) =>{
    const [ counter,setcounter ] = useState(value)
    const handleAdd = () => {
        setcounter(counter +1)
    }
    const handleMinus = () => {
        setcounter(counter -1)
    } 
    const handleReset = () =>{
        setcounter(value)
    }
    return(
        <>
        <h2>{ counter }</h2>
            <button className="button is-primary mr-1" onClick={ handleAdd }>
                +1
            </button>
            <button className="button is-danger mgr-small mr-1" onClick={handleMinus}> 
                -1 
            </button>
            <button className="button is-warning mgr-small" aria-label='btn-reset' onClick={handleReset}>
                 reset 
            </button>
    </>

    )
}
export{
    Counter
}


