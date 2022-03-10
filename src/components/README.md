Aquí van componentes que se pueden ocupar globalmente, más genéricos.

El index.js es para poder importar los componentes en una sola línea:
`import { TextField, Select, Radio } from '@components/forms'`

El index.js seguirá esta estructura:
```
import { TextField } from './TextField/TextField'
import { Select } from './Select/Select'
import { Radio } from './Radio/Radio'

export { TextField, Select, Radio }
```
