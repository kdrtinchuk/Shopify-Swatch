//Please check jquery file is loaded on you site......

//Add this script in below the product template.


  $(document).ready(function() {

    {%- unless product.has_only_default_variant -%}
    var add_text = $('[name="add"]').data('add-text');
    var sold_text = $('[name="add"]').data('sold-text');
    var mf = "{{ shop.money_format }}";

    function addBtnText(disable, text, btnClass) {
      if (!btnClass) {
        return;
      }
      if (disable) {
        btnClass.prop('disabled', true);
        if (text) {
          btnClass.html(text);
        }
      } else {
        btnClass.prop('disabled', false);
        btnClass.html(add_text);
      }
    }

    function varaintSelect(form) {
      var section = form.find('.varaint-selector').data('section');
      var url = form.find('.varaint-selector').data('url');
      var getVariantData = JSON.parse(form.find('[type="application/json"]').text());
      var fieldsets = form.find('.product-form__input').toArray();
      var addButton = $('[name="add"]');
      var options = [];

      $.each(fieldsets, function (i, v){ 
        var value = $(v).find("input[type='radio']:checked").val();
        options.push(value);
      });

      var currentVariant;

      $.each(getVariantData, function (i, variant){
        var lll = 0;
        $.each(variant.options, function (index, option){ 
          if(options[index] !== option){
            lll = 1;
          }
        });
        if(lll == 0){
          currentVariant = variant;
        }
      });

      addBtnText(true, '', addButton)

      if (!currentVariant) {
        addBtnText(true, '', addButton);
        if (!addButton) {
          return;
        }
        addButton.html('Unavailable');
      } else {

        if (currentVariant.featured_media) {
          var newMedia = $('[data-media]');
          if (!newMedia) {
            return
          }
          newMedia.attr('src', currentVariant.featured_media.preview_image.src);
        };

        if (!currentVariant) {
          return;
        }

        window.history.replaceState({ }, '', url+'?variant='+currentVariant.id);

        const input = form.find('input[name="id"]');
        input.val(currentVariant.id).trigger('chnage');

        $.get(url+'?variant='+currentVariant.id+'&section_id='+section, function(data){
          addBtnText(!currentVariant.available, sold_text, addButton);
        });
      }
    }
    function addClass(cls) {
      $('.'+cls).parents('ul').find('li').removeClass('active');
      $('.'+cls).addClass('active');
    }
    $(window).on("load", function() {
      var form = $('.product_fm');
      varaintSelect(form);
      var cls = $('.product-form__input input:checked').data('option');
      addClass(cls)
    });

    $('.variant-radios input').on('change', function() {
      var form = $(this).closest('form');
      varaintSelect(form);
      var cls = $(this).data('option');
      addClass(cls)
    });
    {%- endunless -%}

  });
     
