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

      //Intended line of code for querying Object ID
      //const ObjectId = req.query.ObjectIdId;

      // Fetch existing review by Object ID
      


      let newReviewMade = {
        date: chosenDate,
        name: req.body.name,
        rating: req.body.rating,
        comments: req.body.comments
        
      }
      
      const endGoal = await dbRetriever.insertOne('reviews', newReviewMade);

      if (endGoal.acknowledged) {
        res.status(200).json({message: "Inserted record"});
      } else {
        res.status(500).json({error: "Error inserting reviews in database"});
      }

      const existingReview = await fetchDocumentById('reviews', reviewId);

      if (existingReview) {
        console.log('Found existing review. Allowing update...');
        dbRetriever.updateOne ('reviews', {existingReview: newReviewMade}) //complete this.
        return res.status(200).json({message: "Review left successfully"})
      
      }else {
        console.log("No review found with id " + req.body.id + " aborting...");
        return res.status(400).json({error: "No review found with the given id"});
      } 
      
          
    } catch (error) {
      console.error('Error handling review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
}; 