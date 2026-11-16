require 'yaml'

# Full parsing of the YAML we author, not a substitute for behavioral evaluation.
Dir.glob('{skills,plugins/**/skills}/*/SKILL.md').each do |path|
  text = File.read(path)
  raise "Missing frontmatter: #{path}" unless text.start_with?("---\n")
  metadata = YAML.safe_load(text.split('---', 3)[1])
  name = File.basename(File.dirname(path))
  raise "Invalid metadata: #{path}" unless metadata['name'] == name && metadata['description'].is_a?(String)
  ui = YAML.safe_load(File.read(File.join(File.dirname(path), 'agents/openai.yaml')))['interface']
  raise "Invalid UI: #{path}" unless (25..64).include?(ui['short_description'].length) && ui['default_prompt'].include?("$#{name}")
  puts "#{name}: YAML parsed"
end
