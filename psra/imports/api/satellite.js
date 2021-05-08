import { Mongo } from 'meteor/mongo';

export const SatelliteCollection = new Mongo.Collection('satellite');
export const SchemaCollection = new Mongo.Collection('schema');
