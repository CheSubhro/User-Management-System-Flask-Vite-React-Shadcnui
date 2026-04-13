
# Data validation logic


from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    
    phone = fields.Str(allow_none=True)
    age = fields.Int(validate=validate.Range(min=18, max=100), allow_none=True)
    dob = fields.Str(allow_none=True) # Date of Birth
    gender = fields.Str(validate=validate.OneOf(["male", "female", "other"]))
    skills = fields.List(fields.Str(), load_default=[])
    
    notifications = fields.Bool(load_default=True)
    address = fields.Str(allow_none=True)
    country = fields.Str(load_default="India")
    isPublic = fields.Bool(load_default=True)
    userRole = fields.Str(load_default="Viewer")
    bio = fields.Str(allow_none=True)
    githubUrl = fields.Str(allow_none=True) 
    isTermsAccepted = fields.Bool(required=True) 

user_schema = UserSchema()