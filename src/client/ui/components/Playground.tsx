import React from 'react'

interface TabProps {
  id: string
  name: string
  label: string
  selectedItem: string
  onChange: (a: any) => void
}

const RadioOption = ({ id, label, name, onChange, selectedItem, ...domProps }: TabProps) => {
  return (
    <label
      {...domProps}
      htmlFor={id}
      className={`option ${selectedItem === label || selectedItem === id ? 'selected' : ''}`}
    >
      <input type="radio" id={id} name={name} onChange={onChange} />
      {label}
    </label>
  )
}

export const RadioGroup = ({ name, onChange, selectedItem, data }) => {
  return (
    <div className="radio-group">
      {data.map(item => {
        return (
          <RadioOption
            name={name}
            onChange={onChange}
            selectedItem={selectedItem}
            key={item.id}
            {...item}
          />
        )
      })}
    </div>
  )
}
