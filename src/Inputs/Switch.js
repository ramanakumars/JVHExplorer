import '../css/inputs.css'

export default function Switch({ name, options, onChange, selected }) {
    return (
        <div className='react-switch-container'>
            {options.map(([key, option]) => (
                <RadioButton key={key} id={key} option={option} name={name} onChange={(e) => onChange(e)} selected={selected} />
            ))}
        </div>
    )
}

const RadioButton = ({ name, id, option, onChange, selected }) => {
    return (
        <div className='react-switch' onClick={() => onChange(id)}>
            <input type='radio' id={option.name} name={name} value={id} checked={selected.name === option.name ? true : false} onChange={(e) => (e)}/>
            <label htmlFor={id} className='w-full h-full cursor-pointer'>{option.name}</label>
        </div>
    )

}