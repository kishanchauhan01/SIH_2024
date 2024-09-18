<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/herotofu/herotofu">
    <img src="images/logo.png" alt="herotofu" width="80" height="80">
  </a>

<h3 align="center">HeroTofu / react</h3>

  <p align="center">
    React library that will handle form submissions and send FormData or raw JSON effortlessly.
    <br />
    <a href="https://github.com/herotofu/herotofu/blob/main/packages/react"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/herotofu/herotofu/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/herotofu/herotofu/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## Getting Started

### Prerequisites

Get a free form endpoint URL at [https://herotofu.com](https://herotofu.com/form-endpoints). You can also use your own backend, which handles FormData or JSON POST requests.

1. [Signup](https://app.herotofu.com/signup)
2. [Create the new form endpoint](https://app.herotofu.com/forms/-1)
3. Copy the full endpoint URL or just the ID part that should look like `5e3c9090-017d-11ec-bb78-dfaf038986aa`

### Installation

1. Install the NPM package

- for npm:
  ```sh
  npm install herotofu-react --save
  ```
- or for yarn:
  ```sh
  yarn add herotofu-react
  ```
- or for pnpm:
  ```sh
  pnpm add herotofu-react
  ```

2. Have your form endpoint URL.

## Usage

### useFormData()

Sends the `multipart/form-data` request. Can process file uploads, too.

```tsx
import { useFormData } from 'herotofu-react';

function ExampleComponent() {
  const { formState, getFormSubmitHandler } = useFormData('HEROTOFU_FORM_ID_OR_URL');

  const onSubmitCallback = ({ status, data }) => {
    console.log(`The form finished submission in status: ${status} and data: ${JSON.stringify(data)}`);
  };

  return (
    <>
      {!!formState.status && <div>Current form status is: {formState.status}</div>}
      <form onSubmit={getFormSubmitHandler(onSubmitCallback)}>
        <div>
          <input type="text" name="name" placeholder="Your name" />
        </div>
        <div>
          <input type="text" name="email" placeholder="Your email" required />
        </div>
        ... the rest of the inputs ...
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

If you want to include additional data that won't be presented in the form, pass it as a second argument to the `useFormData` hook:

```tsx
const { formState, getFormSubmitHandler } = useFormData('HEROTOFU_FORM_ID_OR_URL', {
  additionalData: 'any string or number',
});
```

The `onSubmitCallback` is optional and can be skipped:

```tsx

const { formState, getFormSubmitHandler } = useFormData('HEROTOFU_FORM_ID_OR_URL');

return (
  <form onSubmit={getFormSubmitHandler()}>
  ...rest of the code
```

### useJsonData()

Sends application/json requests even without an actual form.

```tsx
import { useJsonData } from 'herotofu-react';

function ExampleComponent() {
  const { dataState, sendData } = useJsonData('HEROTOFU_FORM_ID_OR_URL');

  const onSubmitCallback = ({status, data}) => {
    console.log(`The data was sent with status: ${status} and data: ${JSON.stringify(data)}`);
  };

  const handleButtonClick = () => {
    const dataToSend = { name: 'Joe Bloggs', email: 'joe.bloggs@example.com' };
    sendData(onSubmitCallback, dataToSend);
  }

  ...

  return (
    <>
      {!!dataState && <div>Current requests status is: {dataState.status}</div>}
      <div><button onClick={handleButtonClick()}>Send JSON data</button></div>
    </>
  );
}
```

### useSubscribeEmail()

Lightly validates the provided email and sends it to the backend.

```tsx
import { useSubscribeEmail } from 'herotofu-react';

function ExampleComponent() {
  const { subscribeState, subscribe } = useSubscribeEmail('HEROTOFU_FORM_ID_OR_URL');

  const onSubmitCallback = ({ status, data }) => {
    console.log(`The user was subscribed with status: ${status} and data: ${JSON.stringify(data)}`);
  };

  const handleButtonClick = () => {
    subscribe('joe.bloggs@example.com', onSubmitCallback);
  };

  return (
    <>
      {!!subscribeState && <div>Current requests status is: {subscribeState.status}</div>}
      <div>
        <button onClick={handleButtonClick()}>Send JSON data</button>
      </div>
    </>
  );
}
```

_For more examples, please refer to the [Guides](https://herotofu.com/solutions/guides)_

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

- support@herotofu.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[issues-shield]: https://img.shields.io/github/issues/herotofu/herotofu.svg?style=for-the-badge
[issues-url]: https://github.com/herotofu/herotofu/issues
[license-shield]: https://img.shields.io/github/license/herotofu/herotofu.svg?style=for-the-badge
[license-url]: https://github.com/herotofu/herotofu/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/arminaszukauskas
[product-screenshot]: images/screenshot.png
