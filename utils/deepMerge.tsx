import type {SerializableObject} from '@/types/SerializableObject'

export default function deepMerge(A: SerializableObject, B: SerializableObject): SerializableObject {

    let result: SerializableObject = {};

    Object.assign(result, A)

    for(let key in B) {
        if(!(key in A)){
            result[key as keyof SerializableObject] = B[key]
        }else{
            if(typeof A[key] === 'object' && typeof B[key] === 'object'){
                result[key] = deepMerge(A[key as keyof SerializableObject] as SerializableObject, B[key as keyof SerializableObject] as SerializableObject)
;
            }else{
                result[key] = B[key];
            }
        }
    }


    return result
}