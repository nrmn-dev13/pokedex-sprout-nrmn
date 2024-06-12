function isValidName(name) {
  const terms = name.split(' ');
  const minTerms = 2;
  const maxTerms = 3;

  if (terms.length < minTerms || terms.length > maxTerms) {
    return false;
  }

  const isWord = (term) => /^[A-Z][a-z]+$/.test(term);
  const isInitial = (term) => /^[A-Z]\.$/.test(term);

  for (let term of terms) {
    if (!isWord(term) && !isInitial(term)) {
      return false;
    }
  }

  if (terms.length === 2) {
    return (isInitial(terms[0]) && isWord(terms[1])) ||
      (isWord(terms[0]) && isWord(terms[1]));
  }

  if (terms.length === 3) {
    return isWord(terms[2]) &&
      ((isInitial(terms[0]) && isInitial(terms[1])) ||
        (isWord(terms[0]) && isInitial(terms[1])) ||
        (isWord(terms[0]) && isWord(terms[1])));
  }

  return false;
}


