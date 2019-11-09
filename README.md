# UnpasturizedBot
tools for monitoring and automating the CheezeWizards Unpasteurized tournament (to be open-sourced at a later date)


## ToDo - Main Script

- [x] change event logs to write to a json file
- [x] parse events by function sigs and useful info
- [x] verifiy tx later
- [x] incorporate function parsing by sig
- [x] incorporate tx confirmation
- [x] add event catching for finialized txs
- [x] mold handling
- [x] ascension handling
- [x] generic method to return current time window
- [x] rework ascension to read from state when challenged
- [x] test garbage data send
- [ ] trigger events at the change between windows
- [ ] test garbage data send on react
- [ ] detect dr opportunities
- [ ] detect ascensions challenge
- [ ] smart pause detection
- [ ] smart gas handling
- [ ] smart nonce handling
- [ ] smart account management
- [ ] cull rivals

## ToDo - Else

- [ ] write middleware contract with gastoken and smart require statements
- [ ] write version that triggers dr in constructor subcall
- [ ] write version that uses maleble create2 contracts