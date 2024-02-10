import { listContacts, getContactById, removeContact, addContact, updateContact, updateFavoriteStatus } from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js"

export const getAllContacts = async (req, res) => {
  const allContacts = await listContacts();
  res.status(200).json(allContacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await getContactById(contactId);

    if (contact) {
      res.status(200).json(contact);
    } else {
      throw HttpError(400, error.message);
    }
  } catch (error) {
    res.status(400).json({ error: 'Contact not found' });
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await removeContact(contactId);

    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
     throw HttpError(400, error.message);
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = req.body;
    const createdContact = await addContact(newContact);

    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContacts = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const updatedContactInfo = req.body;

    if (Object.keys(updatedContactInfo).length === 0) {
      throw HttpError(400, error.message);
    }

    const { error } = updateContactSchema.validate(updatedContactInfo);
    if (error) {
      throw HttpError(400, error.message);
    }

    const updatedContact = await updateContact(contactId, updatedContactInfo);

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      throw HttpError(400, error.message);
    }
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { favorite } = req.body;

    if (typeof favorite !== 'boolean') {
      throw HttpError(400, error.message);
    }

    const updatedContact = await updateFavoriteStatus(contactId, favorite);

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
     throw HttpError(400, error.message);
    }
  } catch (error) {
    next(error);
  } 
};