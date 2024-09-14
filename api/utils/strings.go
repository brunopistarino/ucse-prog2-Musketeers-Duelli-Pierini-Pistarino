package utils

import "unicode"

func FindUpperNumberSpecialChar(s string) bool {
	var upper bool
	var number bool
	var specialChar bool
	// Find the first number in the string
	for _, c := range s {
		if upper && number && specialChar {
			return true
		}
		if unicode.IsUpper(c) {
			upper = true
			continue
		}
		if unicode.IsNumber(c) {
			number = true
			continue
		}
		if unicode.IsPunct(c) || unicode.IsSymbol(c) {
			specialChar = true
			continue
		}
	}
	if upper && number && specialChar {
		return true
	}
	return false
}
