function Input({
    label,
    type = 'text',
    value,
    onChange,
    name,
    placeholder = '',
    required = false
}) {
    return (
        <label>
            {label}

            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                placeholder={placeholder}
                required={required}
            />
        </label>
    );
}

export default Input;