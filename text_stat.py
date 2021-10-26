import sys
import textstat

test_data = sys.argv[1]

ans = []

# ans.append(textstat.flesch_reading_ease(test_data))
# ans.append(textstat.flesch_kincaid_grade(test_data))
# ans.append(textstat.smog_index(test_data))
# ans.append(textstat.coleman_liau_index(test_data))
ans.append(textstat.automated_readability_index(test_data))
ans.append(textstat.reading_time(test_data, ms_per_char=14.69))
ans.append(textstat.flesch_reading_ease(test_data))
# ans.append(textstat.dale_chall_readability_score(test_data))
# ans.append(textstat.difficult_words(test_data))
# ans.append(textstat.linsear_write_formula(test_data))
# ans.append(textstat.gunning_fog(test_data))
# ans.append(textstat.text_standard(test_data))
# ans.append(textstat.fernandez_huerta(test_data))
# ans.append(textstat.szigriszt_pazos(test_data))
# ans.append(textstat.gutierrez_polini(test_data))
# ans.append(textstat.crawford(test_data))
# ans.append(textstat.gulpease_index(test_data))
# ans.append(textstat.osman(test_data))
ans.append(textstat.sentence_count(test_data))
ans.append(textstat.char_count(test_data, ignore_spaces=True))
ans.append(textstat.letter_count(test_data, ignore_spaces=True))

print(ans)