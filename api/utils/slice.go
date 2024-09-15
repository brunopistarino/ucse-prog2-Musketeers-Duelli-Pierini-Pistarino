package utils

func StringExistsInSlice(s string, slice []string) bool {
	for _, item := range slice {
		if item == s {
			return true
		}
	}
	return false
}

func SliceToString(slice []string) string {
	var str string
	for i, s := range slice {
		if i > 0 {
			str += ", "
		}
		str += s
	}
	return str
}

func HasDuplicates[T comparable](arr []T) bool {
	seen := make(map[T]bool)

	for _, val := range arr {
		if seen[val] {
			return true
		}
		seen[val] = true
	}
	return false
}

func ContainsSubstring(strings []string, substr string) bool {
	// Check if the substring is in any of the strings in the slice
	for _, str := range strings {
		if len(str) >= len(substr) && str[:len(substr)] == substr {
			return true
		}
	}
	return false
}

func EmailString(strings []string) string {
	// Return the string that starts with "Email"
	result := ""
	for _, str := range strings {
		if len(str) >= len("Email") && str[:len("Email")] == "Email" {
			result = str
			return result
		}
	}
	return result
}
