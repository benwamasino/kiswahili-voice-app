import SQLite from 'react-native-sqlite-storage';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
}

export class DatabaseService {
  private static db: any = null;

  static async init(): Promise<void> {
    if (this.db) return;

    this.db = await SQLite.openDatabase(
      {
        name: 'kiswahili_messages.db',
        location: 'default',
      },
      () => console.log('Database opened'),
      (error) => console.error('Database error:', error)
    );

    await this.createTables();
  }

  private static async createTables(): Promise<void> {
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
      []
    );
  }

  static async saveMessage(message: Message): Promise<void> {
    await this.init();
    await this.db.executeSql(
      'INSERT INTO messages (text, timestamp) VALUES (?, ?)',
      [message.text, message.timestamp.getTime()]
    );
  }

  static async getMessages(limit: number = 100): Promise<Message[]> {
    await this.init();
    const [results] = await this.db.executeSql(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );

    const messages: Message[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      messages.push({
        id: row.id,
        text: row.text,
        timestamp: new Date(row.timestamp),
      });
    }

    return messages;
  }

  static async deleteMessage(id: number): Promise<void> {
    await this.init();
    await this.db.executeSql('DELETE FROM messages WHERE id = ?', [id]);
  }

  static async clearAllMessages(): Promise<void> {
    await this.init();
    await this.db.executeSql('DELETE FROM messages', []);
  }
}
