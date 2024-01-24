import "../services/contactsService.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = (req, res) => {
  const allContacts = contactsService.listContacts();
  res.status(200).json(allContacts);
};

export const getOneContact = (req, res) => {
  const contactId = req.params.id;
  const contact = contactsService.getContactById(contactId);

  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = (req, res) => {
  const contactId = req.params.id;
  const deletedContact = contactsService.removeContact(contactId);

  if (deletedContact) {
    res.status(200).json(deletedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = (req, res) => {

  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const newContact = req.body;
  const createdContact = contactsService.addContact(newContact);

  res.status(201).json(createdContact);
};

export const updateContact = (req, res) => {
  const contactId = req.params.id;
  const updatedContactInfo = req.body;

  if (Object.keys(updatedContactInfo).length === 0) {
    return res.status(400).json({ message: "Body must have at least one field" });
  }

  const { error } = updateContactSchema.validate(updatedContactInfo);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const updatedContact = contactsService.updateContact(contactId, updatedContactInfo);

  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

