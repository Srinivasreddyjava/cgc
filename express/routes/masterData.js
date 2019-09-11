const express = require('express');
const router = express.Router();
const admin = require('../models/admin');
const Staff = require('../models/staff');
const Area = require('../models/area');
const Task = require('../models/task');
const Child = require('../models/child');
const ChildTasks = require('../models/child_tasks');
const moment = require('moment');
const deChild = require('../models/de-child');
const DeStaff = require('../models/de-staff')
const Dummy = require('../models/dummy');
var async = require("async");
const ImageThumbnail = require('image-thumbnail');
const Counter = require('../models/counter');

const areas_array = [
    {
        number: 1,
        name: 'Visual Performance',
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Receptive Language',
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Imitation',
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Vocal Imitation',
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Requests',
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Labeling',
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Interverbal',
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Spontaneous Vocalizations',
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Syntax and Grammer',
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Play and Leisure Skills',
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Social Interaction Skills',
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Group Instruction',
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Fellow Classroom Routines',
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Generalized Responding',
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Reading Skills',
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Math Skills',
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Writing Skills',
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Spelling',
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Dressing Skills',
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Eating Skills',
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Grooming Skills',
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Toileting Skills',
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Gross Motor Skills',
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Fine Motor Skills',
        added_time: moment.now()
    },
];

// Tasks of each areas
const vp_tasks = [
  {
        number: 1,
        name: 'Puzzle with single-piece type of inset',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Form box',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Match identical objects to sample',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Match objects to pictures',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Match identical pictures to sample',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Match pictures to objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Fluent matching',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Sort non-identical items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Block designs on picture card',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Puzzles with multiple connecting pieces in an inset type frame',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Puzzles with a square-edged border frame',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Block designs from picture',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Sequence pattern to match a visual model',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Puzzles with multiple pieces which must be juxtaposed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Jigsaw puzzles',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Match associated pictures',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Sort by function',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Sort by feature',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Sort by class',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Delayed replication of a sequence',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Delayed finding a sample',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Extend a sequence pattern',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Replicate simple 3-dimensional objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Dependent matching sequence',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Seriation',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Picture sequences',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Mazes',
        area_id: null,
        added_time: moment.now()
    }
];

const rl_tasks = [
  {
        number: 1,
        name: 'Responds to own name',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Follow instructions to do an enjoyable action in context',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Follow instructions to look at a reinforcing item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Follow instructions to touch a reinforcing item in various positions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Follow instructions to touch a common item in various positions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Follow instructions to do an enjoyable action out of context',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Follow instructions in routine situations',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Follow instructions to give a named, non-reinforcing object',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Follow instructions to do a simple motor action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Follow instructions to touch item vs. a distracter',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Follow instructions to select one reinforcing item from an array of two objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Follow instructions to select one of two reinforcing items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Follow instructions to select one of two common objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Select one of two pictures of common items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Touch two body parts',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Select one of six or more objects on a table',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Select one of six or more pictures on a table',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Acquires new selection skills without intensive training',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Fluent receptive discriminations',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Varied instructions to select using any response',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Point to body parts on others or pictures',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Touch own pieces of clothing',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Touches parts of items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Select adjectives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Select items by following another\'s gaze',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Follows hand signals',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Follow an instruction to go to a person',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Follow an instruction to give an item to a person or place item on an object',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 29,
        name: 'Follow an instruction to walk to someone and get a named item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 30,
        name: 'Follow an instruction to go to a person and do an action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 31,
        name: 'Specific motor response in receptive tasks',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 32,
        name: 'Demonstrates a specified action with an object when given different objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 33,
        name: 'Multiple actions with an object',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 34,
        name: 'Demonstrates a specified pretend action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 35,
        name: 'Select one of the three pictures representing actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 36,
        name: 'Select associated pictures',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 37,
        name: 'Select by function',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 38,
        name: 'Select by feature',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 39,
        name: 'Select by class',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 40,
        name: 'Select two items from a larger set',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 41,
        name: 'Select two items in sequence from a larger set',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 42,
        name: 'Select community helpers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 43,
        name: 'Locate objects in larger, complex picture',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 44,
        name: 'Locate objects from parts of objects in larger, complex picture',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 45,
        name: 'Select common environmental sounds',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 46,
        name: 'Selects all examples of an item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 47,
        name: 'Select single items with two specified characteristics',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 48,
        name: 'Select set of items with a specified characteristic',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 49,
        name: 'Select set of items with two specified characteristics',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 50,
        name: 'Follows a multiple component sequence instruction',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 51,
        name: 'Receptive prepositions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 52,
        name: 'Receptive pronouns',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 53,
        name: 'Select pictures representing a location or an activity presented in a scene',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 54,
        name: 'Selects pictures representing emotions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 55,
        name: 'Selects "same" and "different"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 56,
        name: 'Select non-examples',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 57,
        name: 'Selects pictures of social interactions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 58,
        name: 'Follow instructions to look at a common item',
        area_id: null,
        added_time: moment.now()
    }
];

const imitation_tasks = [
    {
        number: 1,
        name: 'Motor imitation usng objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Motor imitation using objects in a discrimination',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Motor imitation of gross motor movement with verbal prompts',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Imitation of leg and foot movements',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Imitation of arm and hand movements',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Imitation discriminating static and kinetic motor movements',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Varied imitation instructions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Imitation of gross motor actions modeled in a mirror',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Imitaion of head movements',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Imitation of mouth and tounge movements',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Imitation of facial/oral motor movements modeled in a mirror',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Motor imitation of fine motor movement',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Imitation of touching objects in sequence',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Imitation of blowing',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Imitate speed of an ongoing action with objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Imitate speed of a recently modeled action with objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Imitate speed of an action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Imitate touchng objects in sequence following a model',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Imitation of a sequence of actions switching with model',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Imitation of a sequence of actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Imitation of intensity of action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Imitation of the number of repetitions of a motor movement',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Simultaneous imitation of motor movement and vocalization',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Motor imitation sequence using multiple objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Imitates motor movement without a direct verbal prompt',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Spontaneously imitates the actions of others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Delayed imitation',
        area_id: null,
        added_time: moment.now()
    }
];

const vocal_imitation_tasks = [
  {
        number: 1,
        name: 'Imitaties sounds on request',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Imitates sequence of single sounds switching with a model',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Imitates initial sounds of words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Imitation of multiple separate sound combinations',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Imitation of short & fast vs elongated/slow sounds',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Imitation of a held sound to a second sound',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Consonant-vowel/vowel-consonant combinations',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Consonant-vowel-consonent-vowel',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Consonant-vowel-consonent combinations',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Imitates consonant blends',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Imitation of words on request',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Imitation of phrases on request',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Imitation oof number sequences on request',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Imitation of short & fast vs elongated/slow words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Imitation of loud vs. soft sounds and words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'epear short message to another person',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Spontaneous imitation of words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Spontaneous imitation of phrases',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Prosody',
        area_id: null,
        added_time: moment.now()
    }
];

const request_tasks = [
  {
        number: 1,
        name: 'Requests by indicating',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Multiply controlled requests',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Requestingwith the reinforcer preset and when asked "What do you want ?"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Spontaneous requests with items present (No prompts)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Spontaneous requests items not present',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Requests with eye contact',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Requests others to perform an action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Requests missing items needed for a task',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Requests with head movements by sying yes/no',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Requests using sentences',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Requests help',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Acquires novel requests without intensive training',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Requests attention',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Requests others to remove an item or stop an activity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Requests using adjectives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Requests using propositions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Requests future items or events',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Requests information using "What"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Requests information using "Where"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Requests information using "Who/Whose"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Requests using adverbs',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Requests using pronouns',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Requests information using "Which"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Requests information using "When"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Requests information using "How"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Requests information using "Can", "Do", "Does" or "Will"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Requests information using "Why"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Spontaneous requests',
        area_id: null,
        added_time: moment.now()
    }
];

const labeling_tasks = [
  {
        number: 1,
        name: 'Labels reinforcers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Labels common objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Labels commn people(actual individuals, not professionals)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Labels pictures of common items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Labels body parts',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Labels pieces of clothing',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Labels common ongoing actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Labels pictures of common actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Fluent labeling',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Acquires novel labels without intensive training',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Labels items using carrier phrase',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Labels parts or features of objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Labels adjectives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Label associated pictures',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Labels item when told one of its features',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Labels item when told its class',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Two-component labels (nouns) with objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Two-component labels (nouns) with picutres',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Labels two-component with carrier phrase',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Two-componnt labels (noun verb)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Two-component labels (noun adjective)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Labels by indicating Yes/No',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Labels fucntion of an item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Labels class of an object',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Discrimination of question to label aspects of items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Labels the class of a set of items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Labels features of items which are missing or incorrect',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Labels exclusion form category(negation)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 29,
        name: 'Identifies obvious problems',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 30,
        name: 'Labels community helpers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 31,
        name: 'Labels items at a distance when others point to it',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 32,
        name: 'Labels common environmental sounds',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 33,
        name: 'Uses carrier phrase when labeling nouns with verbs or adjectives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 34,
        name: 'Labels prepositions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 35,
        name: 'Uses carrier phrass when using prepositions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 36,
        name: 'Labels pronouns',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 37,
        name: 'Uses carrier phrases when using pronouns',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 38,
        name: 'Labels and describes events or items presented in a scene',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 39,
        name: 'Naming specified parts of scenes',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 40,
        name: 'Labels adverbs',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 41,
        name: 'Labels emotions of others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 42,
        name: 'Internal events and emotions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 43,
        name: 'Multiple component naming (three component labels)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 44,
        name: 'Labels (three component +) with a carrier phrase',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 45,
        name: 'Labels social interaction behaviour',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 46,
        name: 'Spontaneous labeling',
        area_id: null,
        added_time: moment.now()
    }
];

const interverbal_tasks = [
  {
        number: 1,
        name: 'Fill in words from songs',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Fill in blanks regarding fun items and activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Sign English words (students who use ASL)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Animal sounds',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Answers questions regarding personal information',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Fill in words describing common activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Intraverbal associations',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Fill in item given function',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Fill in action given item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Answers "What" questions regarding items found in home',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Answers "What" questions regarding functions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Answers "Where" questions regarding items found in home or classroom',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Answers "Where" questions regarding activities done at home or school',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Fill in item given the class',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Multiple responses given specific categories',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Fill in features given the item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Fill in item given its feature',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Fill in class given the item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Name items previous observed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Name previously observed activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Name people previously observed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'With visual display, makes related statements (not naming)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Answers "What" questions relevant to items found in the community',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Answers "What" questions relevant to the activities that he can do in the community',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Answers "Where" questions regarding activities and items found in the community',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Answers question with multiple reponses concerning his immediate community',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'States class givenmultiple class members (examples)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Answers "Who/Whose" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 29,
        name: 'Answers "When" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 30,
        name: 'Discrimination of questions asked about items and activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 31,
        name: 'Answers "Which" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 32,
        name: 'Answers "How" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 33,
        name: 'Answers "Why" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 34,
        name: 'Describes steps in sequence of a daily activity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 35,
        name: 'States activity when tld sequence of actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 36,
        name: 'States item when told its functions, features, or class (multiple features)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 37,
        name: 'Interverbal Yes/No with "Can", "Do", "Does", or "Will" answers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 38,
        name: 'Answers questions contianing three critial stimuli (multiple component questions with multiple responses)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 39,
        name: 'Describes items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 40,
        name: 'Describes steps before and after in sequence of daily activity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 41,
        name: 'Answers questions concerining past and upcoming events',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 42,
        name: 'Maintains a conversation with an adult or peer',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 43,
        name: 'Answers novel questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 44,
        name: 'Answers questions relevant to current events',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 45,
        name: 'Answers questions with multiple responses concerning current events',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 46,
        name: 'Answers questions with multiple responses in group discussions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 47,
        name: 'Tells about stories/ Tells stories',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 48,
        name: 'Spontaneous conversation',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 49,
        name: 'Provides opposites when given comparison',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 50,
        name: 'Answers "What" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 51,
        name: 'Answers "Where" questions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 52,
        name: 'Name items previously observed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 53,
        name: 'Answers questions relevant to events in their immediate community single responses',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 54,
        name: 'Answers questions re: academic material',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 55,
        name: 'Multiple responses to questions relevant to academic material',
        area_id: null,
        added_time: moment.now()
    }
];

const spontaneous_vocalization_tasks = [
  {
        number: 1,
        name: 'Vocalize identifiable speech sounds',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Spontaneously says words or approximations to',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Spontaneously says phrases',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Sings songs with models',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Sing songs',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Spontaneous vocal imitation',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Spontaneous requests',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Spontaneous labeling',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Spontaneous conversation',
        area_id: null,
        added_time: moment.now()
    }
];

const syntax_tasks = [
  {
        number: 1,
        name: 'Mean length response',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Syntax (word order)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Articles',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Verbs-preset progressive',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Regular plulrals',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Verbs-irregular past tense',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Contractions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Is/am with "ing" verb',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Vebs-regular past tense',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Possessive "S"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Negatives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Locatives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Future tense',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Conjunctions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Irregular Plurals',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Comparatives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Demonstratives',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Label strength of a verbal response',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Quantification of a verbal response',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Label emotional state associated with verbal response',
        area_id: null,
        added_time: moment.now()
    }
];

const play_skills_tasks = [
  {
        number: 1,
        name: 'Explores toys in the environment',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Allows others to manipulate/touch toys',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Independent outdoor activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Indipendent indoor leisure activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Plays with toys/manipulates toys as designed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Independently plays with toys and engages in verbal behaviour',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Multiple responses with toys related to a theme',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Plays interactivly with other students',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Plays interactively with a variety of peers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Sociodramatic play',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Plays with toys and talks with peers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Plays simple ball games',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Coordinated play woth peers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Interactive motor games',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Board games',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Outdoor games and activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Plays interactively with other students',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Appropriate interactive leisure activities',
        area_id: null,
        added_time: moment.now()
    }
];

const social_interaction_skills_tasks = [
  {
        number: 1,
        name: 'Appropriate when near peers or siblings',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Takes offered items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Tolerates/ responds appropriately to positive touches by peers or siblings',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Shows interest in the behavious of others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Looks at others to start a social interaction',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Physically approaches and engages others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Looks at others in anticipation of completing a reinforcing action',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Listener-receptive',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Imitates peers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Returns greetings',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Physically prompts others to do activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Respondes to approaches and attempts to interact from peers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Sharing-gives-up items to otherse',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Searches for missing person',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Active attention seeking',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Labels items for others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Eye contact',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Asks peers for items (single)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Sharing -asks for items to be shared',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Sharing- offers items to others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Initiates greetings',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Joins peers in an activity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Observation of peers\' attention to activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Feedback from peers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Adjusts behaviour based on changes in peers\' actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Assists other to participate',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'States what otherse like/dislike',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Direct others attentions to something of interest',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 29,
        name: 'Attends to interests of others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 30,
        name: 'Delivers a message',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 31,
        name: 'Waits for break into conversation',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 32,
        name: 'Converses with others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 33,
        name: 'Asks for information',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 34,
        name: 'Obtains and maintains attention of others',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 35,
        name: 'Sharing -accepts offers/invitation to join',
        area_id: null,
        added_time: moment.now()
    }
];

const group_inst_tasks = [
  {
        number: 1,
        name: 'Sits appropriately in small group',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Sits appropriately in large group',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Attends to teacher in group',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Attends to other student in group',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Follows group instructions- all do the same receptive response',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Follows group instructions with a discrimination',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Raises hand to get teacher attention to do an activity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Raises hand to answer a question',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Raises hand AND names item',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Raises hand AND answers a question',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Takes turns during instruction',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Learns new skills in group teaching format',
        area_id: null,
        added_time: moment.now()
    }
];

const follow_class_routines_tasks = [
  {
        number: 1,
        name: 'Follows daily routines (backpacks, etc)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Works independently on non-academic activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Sits and waits appropriately during transitions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Physically transitions to next area or activity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Waits turn to do activities (wash hands, etc)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Gets in the line on request',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Works independently on academic activities',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Gets and returns own materials',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Completes a task and brings work to teacher or puts away materials',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Stands and waits appropriately during transitions',
        area_id: null,
        added_time: moment.now()
    }
];

const general_responding_tasks = [
  {
        number: 1,
        name: 'Generalizes across stimuli',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Generalize across instructors',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Generalize across environments',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Use of skillls in groups',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Generalized response forms',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Generalization of language skills',
        area_id: null,
        added_time: moment.now()
    },
];

const reading_skills_tasks = [
  {
        number: 1,
        name: 'Receptive letters',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Labels letters',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Receptive sounds of letters',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Labels sounds of letters',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Match words with pictures',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Match words to words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Names letters in words reading left to right',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Match individual letters to letter on word card',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Fill in missing letter of words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'read simple words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Decode words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Read small groups of words from left to right',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Read simple sentences (3-6 words)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Fills-in missing words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Reads and follows simple instructions to do actions',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Reads and follows simple instructions on worksheets',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Read passages and answer comprehension questions',
        area_id: null,
        added_time: moment.now()
    }
];


const math_skills_tasks = [
  {
        number: 1,
        name: 'Rote counts with prompts',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Rote counting',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Count objects with prompts',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Count given objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Count out objects from a larger set',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Names numerals in sequence',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Names numbers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Match number with same amount of objects',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: '"more" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: '"less" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: '"some" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: '"all" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: '"zero/none" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Add items to specified quantity',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: '"same" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: '"different" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: '"greater" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: '"add" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Gets specified number of identical items',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Add numbers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Time telling',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Identify coins by value',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Identify all coins by value',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Interchange coins to arrive at equal values',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: '"equal" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: '"unequal" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: '"minus" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: '"plus" receptive and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 29,
        name: '"subtract/take away" receptie and labels',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 30,
        name: 'Labels "same"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 31,
        name: 'Labels "different"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 32,
        name: 'Labels "equal"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 33,
        name: 'Labels "unequal"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 34,
        name: 'Labels "more"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 35,
        name: 'Labels "less"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 36,
        name: 'Labels "greater"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 37,
        name: 'Labels "some"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 38,
        name: 'Labels "all"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 39,
        name: 'Labels "add"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 40,
        name: 'Labels "minus"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 41,
        name: 'Labels "plus"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 42,
        name: 'Labels "subtract/take away"',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 43,
        name: 'Labels "zero/none"',
        area_id: null,
        added_time: moment.now()
    },
];


const writing_tasks = [
  {
        number: 1,
        name: 'Mark on paper',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Color between lines',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Trace lines and shapes',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Trace letter and numbers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Copy straight lines',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Copy curved lines',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Copy letters (with sample)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Copy numbers (with sample)',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Print letters',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Print numbers',
        area_id: null,
        added_time: moment.now()
    }
];

const spelling_tasks = [
  {
        number: 1,
        name: 'Match individual letters to letters on word card',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Fill in missing letter words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Copy words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Writes in missing letter of words',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Spell words vocally',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Spell words in written form',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Spell own name',
        area_id: null,
        added_time: moment.now()
    }
];

const dressing_tasks = [
  {
        number: 1,
        name: 'Pants up and down',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Shoes on and off',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Pullover shirts on and take off',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Buttoning shirts on and off',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Pants on and off',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Socks on and off',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Coat on and off',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Unzip zipper',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Fasten zipper',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Use zipper on clothes',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Use buckles',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Adjust clothing when needed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Tie shoes',
        area_id: null,
        added_time: moment.now()
    }
];

const eating_tasks = [
  {
        number: 1,
        name: 'Eat finger foods',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Drink from a straw',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Drink from a cup',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Feed self with a spoon and fork',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Spread with a knife',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Pour liquid into a cup',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Cut food with a knife',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Take prepared lunch to table',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Clean-up table after meals',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Keep eating areas clean',
        area_id: null,
        added_time: moment.now()
    }
];

const grooming_tasks = [
  {
        number: 1,
        name: 'Wash hands',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Dry hands',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Wash face',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Dry face',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Comb or brush hair',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Brush teeth',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Blow nose when needed',
        area_id: null,
        added_time: moment.now()
    }
];

const toileting_tasks = [
  {
        number: 1,
        name: 'Urinate in toilet',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Remain dry (urine) on a toileting schedule',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Independently use familiar restroom for urination',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Requests to use toilet when needed',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Wipe self after urinating',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Defecate in toilet',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Remain clean (bowel movement) on a toileting schedule',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Wipe self after bowel movement',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Independently use familiar restroom for bowel movements',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Use restroom without assistance',
        area_id: null,
        added_time: moment.now()
    }
];

const gross_motor_tasks = [
  {
        number: 1,
        name: 'Walk forward with appropriate gait',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Kneel',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Run smoothly',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Roll sideways',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Jump forward',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Jump down',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Walk backward',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Hop on two feet',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Throw ball from chest or overhand',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Roll a ball',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Climb a ladder using reciprocal motion',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Creep on stomach',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Squat',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Walk across a balance',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Catch a ball any method',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Ride a tricycle',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Walk sideways',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Gallop',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Balance on one foot',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Kick ball at target',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Hang from bar',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Catch a ball in hands',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Throw ball underhand',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Toss and catch a ball',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Bounce a ball',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Kick a moving ball',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Pump while swinging',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Skip',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 29,
        name: 'Jumping jacks',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 30,
        name: 'Ride a bicycle',
        area_id: null,
        added_time: moment.now()
    }
];

const fine_motor_tasks = [
  {
        number: 1,
        name: 'Mark on paper with a crayon',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 2,
        name: 'Places objects in a form box',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 3,
        name: 'Single-piece inset puzzle',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 4,
        name: 'Multiple puzzle pieces into a frame',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 5,
        name: 'Blocks on block design cards',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 6,
        name: 'Transfer objects to the opposite hand',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 7,
        name: 'Places pegs in a peg board',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 8,
        name: 'Turns pages of a book',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 9,
        name: 'Clothespins on a line',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 10,
        name: 'Color with boundaries',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 11,
        name: 'Open "Ziplock" type bags',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 12,
        name: 'Snips with scissors',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 13,
        name: 'Stacks blocks',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 14,
        name: 'Strings beads',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 15,
        name: 'Remove lids of jars',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 16,
        name: 'Cuts across paper with scissors',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 17,
        name: 'Trace lines with a finger',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 18,
        name: 'Squeezes glue from a bottle',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 19,
        name: 'Remove wrappers',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 20,
        name: 'Roughly copy shapes and patterns',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 21,
        name: 'Paste shapes on outlined picture',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 22,
        name: 'Paste shapes on plain paper picture',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 23,
        name: 'Objects (rings) on pegs',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 24,
        name: 'Replace lids of jars',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 25,
        name: 'Uses pincer grip',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 26,
        name: 'Fold apiece of paper',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 27,
        name: 'Cuts out shapes',
        area_id: null,
        added_time: moment.now()
    },
    {
        number: 28,
        name: 'Accurately copy shapes and patterns',
        area_id: null,
        added_time: moment.now()
    }
];



// Check if collection is empty and insert above data if empty
Area.countDocuments((err, count) => {
    if (!err && count === 0) {
        // Insert
        Area.insertMany(areas_array, (err, docs) => {
            if (!err && docs) {
                docs.forEach(area => {

                    switch (area.name) {

                        case "Visual Performance":
                            var count = 0;
                            vp_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === vp_tasks.length) {
                                    Task.insertMany(vp_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Receptive Language":
                            var count = 0;
                            rl_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === rl_tasks.length) {
                                    Task.insertMany(rl_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Imitation":
                            var count = 0;
                            imitation_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === imitation_tasks.length) {
                                    Task.insertMany(imitation_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Vocal Imitation":
                            var count = 0;
                            vocal_imitation_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === vocal_imitation_tasks.length) {
                                    Task.insertMany(vocal_imitation_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Requests":
                            var count = 0;
                            request_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === request_tasks.length) {
                                    Task.insertMany(request_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Labeling":
                            var count = 0;
                            labeling_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === labeling_tasks.length) {
                                    Task.insertMany(labeling_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Interverbal":
                            var count = 0;
                            interverbal_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === interverbal_tasks.length) {
                                    Task.insertMany(interverbal_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Spontaneous Vocalizations":
                            var count = 0;
                            spontaneous_vocalization_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === spontaneous_vocalization_tasks.length) {
                                    Task.insertMany(spontaneous_vocalization_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Syntax and Grammer":
                            var count = 0;
                            syntax_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === syntax_tasks.length) {
                                    Task.insertMany(syntax_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Play and Leisure Skills":
                            var count = 0;
                            play_skills_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === play_skills_tasks.length) {
                                    Task.insertMany(play_skills_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Social Interaction Skills":
                            var count = 0;
                            social_interaction_skills_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === social_interaction_skills_tasks.length) {
                                    Task.insertMany(social_interaction_skills_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Group Instruction":
                            var count = 0;
                            group_inst_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === group_inst_tasks.length) {
                                    Task.insertMany(group_inst_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Fellow Classroom Routines":
                            var count = 0;
                            follow_class_routines_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === follow_class_routines_tasks.length) {
                                    Task.insertMany(follow_class_routines_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Generalized Responding":
                            var count = 0;
                            general_responding_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === general_responding_tasks.length) {
                                    Task.insertMany(general_responding_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Reading Skills":
                            var count = 0;
                            reading_skills_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === reading_skills_tasks.length) {
                                    Task.insertMany(reading_skills_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Math Skills":
                            var count = 0;
                            math_skills_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === math_skills_tasks.length) {
                                    Task.insertMany(math_skills_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Writing Skills":
                            var count = 0;
                            writing_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === writing_tasks.length) {
                                    Task.insertMany(writing_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Spelling":
                            var count = 0;
                            spelling_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === spelling_tasks.length) {
                                    Task.insertMany(spelling_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Dressing Skills":
                            var count = 0;
                            dressing_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === dressing_tasks.length) {
                                    Task.insertMany(dressing_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Eating Skills":
                            var count = 0;
                            eating_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === eating_tasks.length) {
                                    Task.insertMany(eating_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Grooming Skills":
                            var count = 0;
                            grooming_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === grooming_tasks.length) {
                                    Task.insertMany(grooming_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Toileting Skills":
                            var count = 0;
                            toileting_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === toileting_tasks.length) {
                                    Task.insertMany(toileting_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Gross Motor Skills":
                            var count = 0;
                            gross_motor_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === gross_motor_tasks.length) {
                                    Task.insertMany(gross_motor_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        case "Fine Motor Skills":
                            var count = 0;
                            fine_motor_tasks.forEach(el => {
                                el.area_id = area._id;
                                count++;
                                if (count === fine_motor_tasks.length) {
                                    Task.insertMany(fine_motor_tasks, (err, doc) => {});
                                }
                            });
                            break;

                        default:
                            break;
                    }

                });
            }
        });
    } else {
        Area.find({}).sort({
            added_time: -1
        }).exec((err, docs) => {
        });
    }
});

// Check if admins are empty and if not add admin
admin.countDocuments((err, count) => {
    if (!err && count === 0) {
        const ad = new admin({
            email: 'admin@cgc.com',
            password: 'cgc_admin',
            branchCode: 'ALL'

        });
        ad.save((err, saved) => {
            if (!err && saved) {}
        });
    }
});

module.exports = router;
