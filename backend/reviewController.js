const { ObjectId } = require('mongodb');
const dateHelpers = require('./dateHelpers.js')
const dbRetriever = require('./dbretriever.js')


module.exports.submitReview = async(req, res) => {
    console.log(req.body);

    try {
        if (!req.body.date || !req.body.name || !req.body.rating || !req.body.comments) {
          return res.status(400).json({error: "Form fields are required!"});
        }

      let chosenDate
      //validate date format
      try {
        chosenDate = dateHelpers.getDateFromStub(req.body.date);
      } catch (e) {
        console.error(e);
        return res.status(400).json({error: "Invalid date format for start time, end time, or date"})
      }

      // Fetch existing review by Object ID

      try {
        const objectId = new ObjectId(req.body.id);
      } catch (e) {
        return res.status(400).json({error: "Invalid review key"});
      }

      const existingReview = await dbRetriever.fetchDocumentById('reviews', req.body.id);
      
      if (existingReview) {
        console.log('Found existing review. Allowing update...');

        await dbRetriever.updateOne('reviews', {_id: new ObjectId(req.body.id)}, {$set: 
          {
            submittedDate: new Date(req.body.date),
            rating: req.body.rating,
            isSubmitted: true,
            comments: req.body.comments
          }});

        return res.status(200).json({message: "Review left successfully"})
      } else {
        console.log("No review found with id " + req.body.id + " aborting...");
        return res.status(400).json({error: "No review found with the given id"});
      } 
          
    } catch (error) {
      console.error('Error handling review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
}; 