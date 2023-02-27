import {z} from 'zod'

export default function ZodErrorDisplay({
    zodError
}:{
    zodError?: z.ZodError | null
}){

    if(typeof zodError === 'undefined' || zodError === null){
        return <></>
    }

    let formatted = zodError.flatten()

    let messages: string[] = []

    for(let field in formatted){ // Hacky!
        messages.push(`${field}: ${((formatted as object)[field as keyof object] as string[]).join('. ')}`)
    }

    return <div style={{
        background:"red"
    }}>
        <ul>
            {messages.map((message, index) => <li key={index}>{message}</li>)}
        </ul>
    </div>
}