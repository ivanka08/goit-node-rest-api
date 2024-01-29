import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

const contactsPath = join(process.cwd(), "/db/contacts.json");

async function listContacts() {
  const contactsData = await readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(contactsData);
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact ?? null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
  if (contactIndex !== -1) {
    contacts.splice(contactIndex, 1);
    await writeFile(contactsPath, JSON.stringify(contacts), "utf-8");
    return contacts[contactIndex];
  } else {
    return null;
  }
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const contactId = nanoid();

  const contact = {
    id: contactId,
    name,
    email,
    phone,
  };

  contacts.push(contact);
  await writeFile(contactsPath, JSON.stringify(contacts), "utf-8");
  return contact;
}

async function updateContact(contactId, updatedContactInfo) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId);

  if (contactIndex !== -1) {
    const updatedContact = { ...contacts[contactIndex], ...updatedContactInfo };
    contacts[contactIndex] = updatedContact;

    await writeFile(contactsPath, JSON.stringify(contacts), "utf-8");
    return updatedContact;
  } else {
    return null;
  }
}

export { listContacts, getContactById, removeContact, addContact, updateContact };