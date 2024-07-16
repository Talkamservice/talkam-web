export const handleError = (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
  
    if (error.data && error.data.code) {
        if (error.data.code === 422 && error.data.errors) {
        // Extract the first error message from the errors object
            const firstKey = Object.keys(error.data.errors)[0];
            const firstErrorArray = error.data.errors[firstKey];
        if (firstErrorArray && firstErrorArray.length > 0) {
          errorMessage = firstErrorArray[0];
        }
      } else if (error.data.code === 500) {
        errorMessage = 'Something went wrong on our end. Please try again later.';
      } else if (error.data.message) {
        errorMessage = error.data.message;
      } else {
        errorMessage = `Error: Please try again`;
      }
    } else if (error.name === 'TypeError') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return errorMessage;
};  