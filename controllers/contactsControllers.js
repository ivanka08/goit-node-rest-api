import { listContacts, getContactById, removeContact, addContact, updateContact } from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const allContacts = await listContacts();
  res.status(200).json(allContacts);
};

export const getOneContact = async (req, res) => {
  const contactId = req.params.id;
  const contact = await getContactById(contactId);

  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  const deletedContact = await removeContact(contactId);

  if (deletedContact) {
    res.status(200).json(deletedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {

  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const newContact = req.body;
  const createdContact = await addContact(newContact);

  res.status(201).json(createdContact);
};

export const updateContacts = async (req, res) => {
  const contactId = req.params.id;
  const updatedContactInfo = req.body;

  if (Object.keys(updatedContactInfo).length === 0) {
    return res.status(400).json({ message: "Body must have at least one field" });
  }

  const { error } = updateContactSchema.validate(updatedContactInfo);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const updatedContact = await updateContact(contactId, updatedContactInfo);

  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const updateStatusContact = async (req, res) => {
  const contactId = req.params.contactId;
  const { favorite } = req.body;

  if (typeof favorite !== 'boolean') {
    return res.status(400).json({ message: "Invalid value for 'favorite' field" });
  }

  const updatedContact = await updateFavoriteStatus(contactId, favorite);

  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};