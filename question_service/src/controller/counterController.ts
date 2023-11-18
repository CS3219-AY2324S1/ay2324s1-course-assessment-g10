import Counter from '../model/counterModel';

export const getNextSequenceValue = async (sequenceName : string) => {
    try {
        const sequenceDocument = await Counter.findOneAndUpdate(
            { _id: sequenceName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return sequenceDocument.seq;
    } catch (error) {
        console.error('Error getting the next sequence value:', error);
        throw error;  // or handle this in some other appropriate way
    }
};
