import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Feedback from './Feedback.js';

class InternalNote extends Model {}

InternalNote.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  feedbackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Feedback,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'InternalNote',
  timestamps: true,
  underscored: true
});

// Define the association
Feedback.hasMany(InternalNote);
InternalNote.belongsTo(Feedback);

export default InternalNote;