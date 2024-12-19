const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController {
  async index(request, response) {
    // List all registers
    const contacts = await ContactsRepository.findAll();
    response.json(contacts);
  }

  async show(request, response) {
    // Get one register
    const { id } = request.params;
    const contact = await ContactsRepository.findById(id);

    if(!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    response.json(contact);

  }

  async store(request, response) {
    // Create a new register
    const { name, email, phone, category_id } = request.body;

    if(!name) {
      return response.status(400).json({ error: 'Name is required.' });
    }

    const contactExists = await ContactsRepository.findByEmail(email);

    if (contactExists) {
      return response.status(400).json({ error: 'This email is already in use' });
    }

    const contact = await ContactsRepository.create({
      name,
      email,
      phone,
      category_id
    });

    response.json(contact);
  }

  async update(request, response) {
    // Update a register
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;

    const contactExists = await ContactsRepository.findById(id);

    if(!contactExists) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    if(!name) {
      return response.status(400).json({ error: 'Name is required.' });
    }

    const contactByEmail = await ContactsRepository.findByEmail(email);

    if (contactByEmail) {
      return response.status(400).json({ error: 'This email is already in use' });
    }
  }

  async delete(request, response) {
    // Delete a register
    const { id } = request.params;

    const  contact = await ContactsRepository.findById(id);

    if(!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    await ContactsRepository.delete(id);
    response.sendStatus(204);
  }
}

// Singleton
module.exports = new ContactController();
