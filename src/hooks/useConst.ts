import { useState } from 'react';

export function useConst<Value>(value: () => Value): Value {
    const [state] = useState(value);

    return state;
}
