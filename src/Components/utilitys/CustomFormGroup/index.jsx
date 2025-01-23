import { FormGroup, Label, Input} from 'reactstrap';

export default function CustomFormGroup({ label, type, name, options, value, onChange, error }){

    return (
      <FormGroup>
        <Label for={name}>{label}</Label>
        {type === 'select' ? (
          <Input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={error ? 'border-red-600' : ''}
          >
            <option value="">--Selecciona una opción--</option>
            {options.map(option => (
              <option key={option} value={option.value}>{option.label}</option>
            ))}
          </Input>
        ) : (
          <Input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={error ? 'border-red-600' : ''}
          />
        )}
      </FormGroup>
    );
}