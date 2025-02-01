import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { addContact } from '../../redux/contacts/operations';
import { selectContacts, selectError } from '../../redux/contacts/selectors';

import styles from './ContactForm.module.css';

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const error = useSelector(selectError);

  const formik = useFormik({
    initialValues: {
      name: '',
      number: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Enter at least 3 characters')
        .max(20, 'Please enter no more than 20 characters')
        .required('This field is mandatory'),
      number: Yup.string()
        .matches(/^\d{3}-\d{2}-\d{2}$/, 'Format: XXX-XX-XX')
        .required('This field is mandatory'),
    }),
    onSubmit: (values, { resetForm }) => {
      const duplicate = contacts.find(
        (contact) => contact.name.toLowerCase() === values.name.toLowerCase()
      );

      if (duplicate) {
        alert(`${values.name} is already in contacts!`);
        return;
      }

      dispatch(addContact(values));
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <label htmlFor="name" className={styles.label}>
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        className={styles.input}
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        autoComplete="name"
      />
      {formik.touched.name && formik.errors.name ? (
        <div className={styles.error}>{formik.errors.name}</div>
      ) : null}
      <label htmlFor="number" className={styles.label}>
        Number
      </label>
      <input
        id="number"
        name="number"
        type="text"
        className={styles.input}
        value={formik.values.number}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        autoComplete="tel"
      />
      {formik.touched.number && formik.errors.number ? (
        <div className={styles.error}>{formik.errors.number}</div>
      ) : null}
      {error && <div className={styles.error}>Error: {error}</div>}{' '}
      <button type="submit" className={styles.submitBtn}>
        Add Contact
      </button>
    </form>
  );
};

export default ContactForm;
