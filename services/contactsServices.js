import mongoose from 'mongoose';
import { join } from 'path';
import { nanoid } from 'nanoid';

const contactsPath = join(process.cwd(), '/db/contacts.json');

mongoose.connect('mongodb+srv://Ivanka1:Zxc876ff@cluster0.8dhan4l.mongodb.net/');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

async function listContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error listing contacts:', error.message);
    process.exit(1);
  }
}

async function getContactById(contactId) {
    const contact = await Contact.findById(contactId);
    return contact ?? null;
  
}

async function removeContact(contactId) {
  try {
    const removedContact = await Contact.findByIdAndDelete(contactId);
    return removedContact ?? null;
  } catch (error) {
    console.error('Error removing contact:', error.message);
    process.exit(1);
  }
}

async function addContact({ name, email, phone }) {
  const contactId = nanoid();
  const newContact = new Contact({ id: contactId, name, email, phone });

  try {
    const savedContact = await newContact.save();
    return savedContact;
  } catch (error) {
    console.error('Error adding contact:', error.message);
    process.exit(1);
  }
}

async function updateContact(contactId, updatedContactInfo) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: updatedContactInfo },
      { new: true }
    );
    return updatedContact ?? null;
  } catch (error) {
    console.error('Error updating contact:', error.message);
    process.exit(1);
  }
}

async function updateFavoriteStatus(contactId, favorite) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: { favorite } },
      { new: true }
    );
    return contact ?? null;
  } catch (error) {
    console.error('Error updating favorite status:', error.message);
    return null;
  }
}

export { listContacts, getContactById, removeContact, addContact, updateContact, updateFavoriteStatus };

// This part is for checking the database connection
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
});
db.once('open', () => console.log('Database connection successful'));
