import * as React from 'react';
import Form, { FormProps } from 'react-jsonschema-form';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import { FieldTemplate } from './templates/FieldTemplate';
import { ArrayFieldTemplate } from './templates/ArrayFieldTemplate';
import { ObjectFieldTemplate } from './templates/ObjectFieldTemplate';
import { ErrorListTemplate } from './templates/ErrorListTemplate';
import { schema } from './exampleSchema';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import * as widgets from './widgets';

export class JsonSchemaForm<T> extends React.Component <FormProps<T>> {

  onSubmit = (formData : any) => {

    console.log(this.props)
    console.log({ formData })
    console.log('submitting')
  }

  render () {

    const templates = {
      ArrayFieldTemplate,
      FieldTemplate,
      ObjectFieldTemplate,
      ErrorList: ErrorListTemplate,
      widgets: widgets as any,
    };

    return (
      <InfoPanel>
        <Form
          schema={schema}
          onSubmit={ () => {}}
          showErrorList={true}
          liveValidate
          noHtml5Validate
          { ...templates }
        >
          <p> Required fields are denoted by '*' </p>

          <ProgressButton
            type='submit'
            className="primary hidden"
            loading={ false }
            onClick={this.onSubmit}
          >
            Submit
          </ProgressButton>

        </Form>
      </InfoPanel>
    );
  }
}
